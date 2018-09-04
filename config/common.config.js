require('!!file-loader?name=index.html!@/index.html');

const moduleExports = {
  DIRS: {
    VENDOR_FILE: {
      js: {
        html5shiv: require('!!file-loader?name=static/js/[name].[ext]!../vendor/ie-fix/html5shiv.min.js'),
        respond: require('!!file-loader?name=static/js/[name].[ext]!../vendor/ie-fix/respond.min.js'),
        jquery: require('!!file-loader?name=static/js/[name].[ext]!../vendor/jquery-1.11.3.min.js'),
      }
    }
  },

  PAGE_ROOT_PATH: '../src',
};

/* 帮助确定ie下CORS的代理文件 */
//moduleExports.DIRS.SERVER_API_URL = moduleExports.SERVER_API_URL;

/* global IS_PRODUCTION:true */ // 由于ESLint会检测没有定义的变量，因此需要这一个`global`注释声明IS_PRODUCTION是一个全局变量(当然在本例中并不是)来规避warning
moduleExports.API_ROOT = IS_PRODUCTION ? 'http://api.xxxx.com/' : 'http://localhost/mock/';

module.exports = moduleExports;
