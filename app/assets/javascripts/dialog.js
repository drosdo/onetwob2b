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
    document.body.addEventListener(clickEvent, e => {
      let el = e.target;
      if (el.correspondingUseElement) {
        el = el.correspondingUseElement;
      }
      if (el.closest('.js-dialog-trigger-open')) {
        this.toggleDialog(true);
      }
      if (el.closest('.js-dialog-trigger-close')) {
        this.toggleDialog(false);
      }
    });
  }

  toggleDialog(open) {
    if (open) {
      document.body.classList.add('_dialog-open');
    } else {
      document.body.classList.remove('_dialog-open');
    }
  }
};
