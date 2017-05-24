'use strict';

const Form = require('./form');
const MobileMenu = require('./mobile-menu');
const Dialog = require('./dialog');

module.exports = function () {
  let forms = document.querySelectorAll('.js-form');
  let mobileMenu = document.querySelector('.js-mobile-menu');
  let dialog = document.querySelector('.js-dialog');
  /* FORM */
  if (forms) {
    Array.prototype.forEach.call(forms, form => {
      let options = {
        wrap: form
      };
      new Form(options);
    })
  }
  /* mobileMenu */
  if (mobileMenu) {
    let options = {
      wrap: mobileMenu
    };
    new MobileMenu(options);
  }
  
  /* DIALOG */
  if (dialog) {
    let options = {
      wrap: dialog
    };
    new Dialog(options);
  }
};
