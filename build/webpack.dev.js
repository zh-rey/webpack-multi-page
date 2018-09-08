const baseConfig = require('./webpack.config.js');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const dirVars = require('../config/dir.config.js');

module.exports = merge.smart(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // 开启调试模式
  devServer: {
    contentBase: dirVars.distDir,
    host: "127.0.0.1",
		port: "8089",
    overlay: true, // 浏览器页面上显示错误
    open: true, // 开启浏览器
    stats: "errors-only", // 表示只打印错误
    hot: true // 启用HMR热替换
  },
  module: {
    rules: []
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