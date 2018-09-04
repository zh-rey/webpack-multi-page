const content = require('./content.ejs');
const layout = require('LAYOUT');

module.exports = layout.init({
  pageTitle: '首页',
}).run(content());
