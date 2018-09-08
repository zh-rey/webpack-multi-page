const path = require('path');
let dirExports = {};

// 源文件目录
dirExports.staticRootDir = path.resolve(__dirname, '../'); // 项目根目录
dirExports.srcDir = path.resolve(dirExports.staticRootDir, './src'); // 项目业务代码根目录
dirExports.buildDir = path.resolve(dirExports.staticRootDir, './build'); // webpack配置文件
dirExports.configDir = path.resolve(dirExports.staticRootDir, './config'); // 各种配置文件
dirExports.assetsDir = path.resolve(dirExports.staticRootDir, './src/assets'); // 存放所有静态文件（包括字体，第三方库等）
dirExports.vendorDir = path.resolve(dirExports.staticRootDir, './vendor'); // 存放常用文件
dirExports.layoutDir = path.resolve(dirExports.staticRootDir, './src/layout'); // 存放页面布局模板
dirExports.pagesDir = path.resolve(dirExports.staticRootDir, './src/pages'); // 存放各个页面独有的部分，如入口文件、只有该页面使用到的css、模板文件等
dirExports.componentsDir = path.resolve(dirExports.staticRootDir, './src/components'); // 存放功能组件，html/js/css/image等

// dist文件目录
dirExports.distDir = path.resolve(dirExports.staticRootDir, './dist'); // 存放编译后生成的所有代码、资源（图片、字体等）

module.exports = dirExports;