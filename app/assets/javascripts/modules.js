'use strict';
import Form from './form';
import MobileMenu from './mobile-menu';
import Dialog from './dialog';
import Anchor from './anchor';

module.exports = function () {
  let forms = document.querySelectorAll('.js-form');
  let mobileMenu = document.querySelector('.js-mobile-menu');
  let dialog = document.querySelector('.js-dialog');
  let anchors = document.querySelectorAll('[anchor]');
  /* FORM */
  if (forms) {
    Array.prototype.forEach.call(forms, form => {
      let options = {
        wrap: form,
        data: form.getAttribute('data')
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

  // ANCHOR
  if (anchors) {
    Array.prototype.forEach.call(anchors, anchor => {
      let options = {
        anchor: anchor
      };
      new Anchor(options);
    })
  }
};
