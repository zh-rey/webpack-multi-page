const autoprefixer = require('autoprefixer');

module.exports = {
  plugins : [ 
    autoprefixer({
      remove: false,
      browsers: ['ie >= 8', '> 1% in CN'],
    }),
  ]
};