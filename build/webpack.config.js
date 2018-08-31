const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML模板生成
const glob = require("glob"); // 分离css
const purifyCssWebpack = require("purifycss-webpack"); // 消除冗余的css
const copyWebpackPlugin = require("copy-webpack-plugin"); // 静态资源输出
const extractTextPlugin = require("extract-text-webpack-plugin"); // css文件分离

module.exports = {
  entry: { // 输入
    app: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/image/favicon.ico',
      // title: title,
      inject: true,
      hash: true, //开启hash  ?[hash]
      chunks: [ 'index'],
      minify: process.env.NODE_ENV === "development" ? false : {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true, //去除属性引用
      },
    }),
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
			paths: glob.sync(path.join(__dirname, "../src/html/**/*.html"))
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
  output: { // 输出
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass|less)$/,
        // 区别开发环境和生成环境
        use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "less-loader", "postcss-loader"] : extractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader", "less-loader", "postcss-loader"],
          // css中的基础路径
          publicPath: "../"
    
        })
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
        // 不检查node_modules下的js文件
        exclude: "/node_modules/"
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          // 需要下载file-loader和url-loader
          loader: "url-loader",
          options: {
            limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
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
      }
    ]
  }
};