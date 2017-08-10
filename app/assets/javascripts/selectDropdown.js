'use strict';
let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.selectDropdown = options.selectDropdown;
    this.selectDropdownInput = this.selectDropdown.querySelector('.js-select-dropdown-input');
    this.selectDropdownTrigger = this.selectDropdown.querySelector('.js-select-dropdown-checkbox');

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener(clickEvent, e => {
      let el = e.target;
      if (el.closest('.js-select-dropdown-item')) {
        this.selectDropdownInput.value = el.innerText;
        this.selectDropdownInput.dispatchEvent(new Event('change'));
        this.close();
      }
      if (!el.closest('.js-select-dropdown')) {
        this.close();
      }
    });
  }

  close() {
    this.selectDropdownTrigger.checked = false;
  }
};
