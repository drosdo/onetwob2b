// God save the Dev
'use strict';
// Initial webpack-svg-store plugin
const __svg__ = {
  path: 'assets/svg/*.svg',
  name: 'assets/static/svg/[hash].sprite.svg'
};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);


require('_stylesheets/app.styl');
require('_js/modules')();
// Depends
//var $ = require('jquery');


