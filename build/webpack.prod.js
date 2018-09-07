const baseConfig = require('./webpack.config.js');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // css文件分离
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 文件清理
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const dirVars = require('../config/dir.config.js');

module.exports = merge.smart(baseConfig, {
  mode: "production",
	output: { // 输出
    path: dirVars.distDir,
    publicPath: '/',
    filename: '[name]/entry.[chunkhash].js',    // [name]表示entry每一项中的key，用以批量指定生成后文件的名称
    chunkFilename: '[id].[chunkhash].bundle.js',
  },
	devtool: 'source-map', // cheap-source-map
	module: {
    rules: [
      {
        test: /\.(css|scss|sass|less)$/,
        exclude: "/node_modules/",
        // 区别开发环境和生成环境
        use: ExtractTextPlugin.extract([
					{
						loader: 'css-loader',
						options: {
							minimize: true,
							// '-autoprefixer': true,
						},
					},
					{
            loader: 'postcss-loader',
            options: {
              config: {
                  path: path.resolve(__dirname, '../config'),    // 写到目录即可，文件名强制要求是postcss.config.js
              }
            }
					},
					{
						loader: 'sass-loader',
					},
					{
						loader: 'less-loader',
					}
				])
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
      },
      {
        test: /\.ejs$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'ejs-loader',
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ // 指定生产环境
			'process.env.NODE_ENV': JSON.stringify('production'),
			'IS_PRODUCTION': true,
    }),
    new CleanWebpackPlugin(['dist'], { // 删除dist目录
			root: path.resolve(__dirname, '../'), //根目录
			// verbose Write logs to console.
			verbose: true, //开启在控制台输出信息
			// dry Use boolean "true" to test/emulate delete. (will not remove files).
			// Default: false - remove files
			dry: false,
		}),
    new UglifyJSPlugin({ // 删除冗余代码
      sourceMap: true,
      uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: false,
					drop_console: true
				}
			}
    }),
		new ExtractTextPlugin({ // 分离css插件参数为提取出去的路径
			filename: 'css/[name].[hash:5].min.css',
		}),
		new OptimizeCSSPlugin({ // 压缩css
			cssProcessorOptions: {
				safe: true
			}
    }),
    new BundleAnalyzerPlugin(),
  ]
});