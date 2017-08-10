'use strict';

let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.globalWrap = document.querySelector('.g-wrapper');
    this.toggleButton = this.wrap.querySelector('.js-mobile-menu-toggle');
    this.menuEnabled = false;
    this.bindEvents();
  }

  bindEvents() {
    this.toggleButton.addEventListener(clickEvent, e => {
      this.toggleMenu();
    });
  }

  toggleMenu() {
    if (this.menuEnabled) {
      this.globalWrap.classList.remove('_mobile-menu-open');
      this.menuEnabled = false;
    } else {
      this.globalWrap.classList.add('_mobile-menu-open');
      this.menuEnabled = true;
    }
  }
};
