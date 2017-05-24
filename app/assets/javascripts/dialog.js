'use strict';

let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.triggerOpen = document.querySelector('.js-dialog-trigger-open');
    this.triggerClose = document.querySelector('.js-dialog-trigger-close');
    this.bindEvents();
  }

  bindEvents() {
    this.triggerOpen.addEventListener(clickEvent, e => {
      this.toggleDialog(true);
    });
    this.triggerClose.addEventListener(clickEvent, e => {
      this.toggleDialog();
    });
  }

  toggleDialog(open) {
    if(open){
      document.body.classList.add('_dialog-open');
    } else {
      document.body.classList.remove('_dialog-open');
    }
  }
};
