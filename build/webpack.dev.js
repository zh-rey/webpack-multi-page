const baseConfig = require('./webpack.config.js');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

module.exports = merge.smart(baseConfig, {
  mode: 'development',
  output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		// 生成 a.bundle.[hash].js  b.bundle.[hash].js
		filename: './js/[name].bundle.js'
	},
  devtool: 'cheap-module-eval-source-map', // 开启调试模式
  devServer: {
    contentBase: path.join(__dirname, "../src"),
    host: "127.0.0.1",
		port: "8089",
    overlay: true, // 浏览器页面上显示错误
    open: true, // 开启浏览器
    stats: "errors-only", // 表示只打印错误
    hot: true // 启用HMR热替换
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass|less)$/,
        exclude: "/node_modules/",
        // 区别开发环境和生成环境
        use: ["style-loader", "css-loader", "sass-loader", "less-loader"] 
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
    new webpack.DefinePlugin({ // 指定开发环境
      'process.env.NODE_ENV': JSON.stringify('development'),
      'IS_PRODUCTION': false,
    }),
    new webpack.NamedModulesPlugin(), // 查看要修补(patch)的依赖
    new webpack.HotModuleReplacementPlugin() // HMR热替换
  ]
});