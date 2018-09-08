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
	devtool: 'source-map', // cheap-source-map
	module: {
    rules: [
      {
        test: /\.(css|scss|sass|less)$/,
        exclude: "/node_modules/",
        // 区别开发环境和生成环境
        use: ExtractTextPlugin.extract([
					{
            loader: 'postcss-loader',
            options: {
              config: {
                  path: path.resolve(__dirname, '../config'),    // 写到目录即可，文件名强制要求是postcss.config.js
              }
            }
					},
				])
      }
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
			filename: 'css/[name].min.css',
		}),
    new OptimizeCSSPlugin({ // 压缩css
      cssProcessor: require('cssnano'),
			cssProcessorOptions: {
				preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: false // 控制台消息打印
    }),
    new BundleAnalyzerPlugin(),
  ]
});