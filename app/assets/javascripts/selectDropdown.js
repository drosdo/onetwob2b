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
    document.body.addEventListener(clickEvent, e => {
      let el = e.target;
      if (el.correspondingUseElement) {
        el = el.correspondingUseElement;
      }
      if (el.closest('.js-select-dropdown-item')) {
        this.selectDropdownInput.value = el.innerText;
        this.selectDropdownInput.placeholder = '';
        this.selectDropdownInput.parentNode.classList.add('_placeholder-on');
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
