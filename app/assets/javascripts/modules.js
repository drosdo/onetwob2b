'use strict';

const Form = require('./form');
module.exports = function() {
  console.log('ff')
  if ( document.querySelector('.js-form') ) {
    let options = {
      wrap: document.querySelector('.js-form')
    };
    new Form(options);
  }
};
