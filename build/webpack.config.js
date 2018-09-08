const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML模板生成
const glob = require("glob"); // 文件路径
const purifyCssWebpack = require("purifycss-webpack"); // 消除冗余的css
const copyWebpackPlugin = require("copy-webpack-plugin"); // 静态资源输出

const dirVars = require('../config/dir.config.js');

const options = {
  cwd: dirVars.pagesDir, // 在pages目录里找
  sync: true, // 这里不能异步，只能同步
};
var globInstance = new glob.Glob('!(_)*', options); // 考虑到多个页面共用HTML等资源的情况，跳过以'_'开头的目录
const pageArr = globInstance.found; // ['index/index', 'index/login', 'alert/index']

const entry = {}
pageArr.forEach((page) => {
  entry[page] = path.resolve(dirVars.pagesDir, page + '/page');
});

let configPlugins = {
  entry,
  output: { // 输出
    path: dirVars.distDir,
    publicPath: '../../',  // 输出解析文件的目录，url 相对于 HTML 页面
    filename: 'js/[name]/[name].js',  // 「入口分块(entry chunk)」的文件名模板（出口分块？）
    chunkFilename: 'js/[name].bundle.js',
    hashDigestLength: 5,  // hash长度
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass|less)$/,
        exclude: "/node_modules/",
        // 区别开发环境和生成环境
        use: [
					{
						loader: 'css-loader',
						options: {
              minimize: true,
              sourceMap: true
						},
					},
					{
						loader: 'sass-loader',
					},
					{
						loader: 'less-loader',
					}
				]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   presets: [['es2015', { loose: true }]],
            //   cacheDirectory: true,
            //   plugins: ['transform-runtime'],
            // },
          }
        ],
        // 不检查node_modules下的js文件
        exclude: "/node_modules/"
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          // 需要下载file-loader和url-loader
          loader: "url-loader",
          options: {
            limit: 3 * 1024, //小于这个时将会已base64位图片打包处理
            // 图片文件输出的文件夹
            outputPath: "images"
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        }
      },
      {
        test: /\.html$/,
        // html中的img标签
        use: ["html-withimg-loader"]
      },
      {
        test: /\.ejs$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'ejs-loader',
      },
    ]
  },
  plugins: [
		new webpack.ProvidePlugin({ // 全局暴露统一入口
			$: "jquery",
			jQuery: "jquery",
			'window.jQuery': 'jquery',
    }),
		new copyWebpackPlugin([{ //静态资源输出
			from: path.resolve(__dirname, "../src/assets"),
			to: './assets',
			ignore: ['.*']
		}]),
		new purifyCssWebpack({ // 消除冗余的css代码
			paths: glob.sync(path.join(__dirname, "../src/pages/**/*.html"))
		}),
  ],
	optimization: { 
		splitChunks: {
			cacheGroups: {
				vendor: {
					// test: /\.js$/,
					test: path.resolve(__dirname, '../node_modules'),
					chunks: "initial", //表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
					name: "vendor", //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
					minChunks: 1,
					reuseExistingChunk: true,
					enforce: true
				}
			}
		}
	},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'VENDOR': path.resolve(__dirname, '../vendor'),
      'CONFIG': path.resolve(__dirname, '../config'),
      'LAYOUT': path.resolve(__dirname, '../src/layout/html'),
      'DIST': path.resolve(__dirname, '../dist'),
    }
  }
};
// 多入口HTML模板生成
pageArr.forEach((page) => {
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: `html/${page}/${page}.html`,
    template: path.resolve(dirVars.pagesDir, `./${page}/html.js`),
    chunks: ['webpack-runtime', page, 'commons/commons'],
    hash: true, // 为静态资源生成hash值
    // xhtml: true,
    // inject: true,
    // hash: true, //开启hash  ?[hash]
    // minify: process.env.NODE_ENV === "development" ? false : {
    //   removeComments: true, //移除HTML中的注释
    //   collapseWhitespace: true, //折叠空白区域 也就是压缩代码
    //   removeAttributeQuotes: true, //去除属性引用
    // },
  });
  configPlugins.plugins.push(htmlPlugin);
});

module.exports = configPlugins;