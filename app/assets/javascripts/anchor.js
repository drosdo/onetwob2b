'use strict';
const smoothScroll = require('./smoothscroll.min');

let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';

module.exports = class {
  constructor(options) {
    this.link = options.anchor;
    this.destination = document.querySelector('#' + this.link.getAttribute('anchor') );

    this.link.addEventListener(clickEvent, e => {
      e.preventDefault();
      smoothScroll(this.destination);
    });
  }
};
