'use strict';
const smoothScroll = require('./smoothscroll.min');
require('es6-promise').polyfill();

let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';
import registrationExtraTmpl from '_templates/form/registration-extra.pug';
import registrationBasisFieldTmpl from '_templates/form/registration-basis-field.pug';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.isRegistration = options.data === 'registration';
    this.form = this.wrap.querySelector('form');
    if (this.isRegistration) {
      this.registrationExtraContainer = this.wrap.querySelector('.js-form-registration-extra');
    }
    this.fields = this.wrap.querySelectorAll('.js-form-field');
    this.errors = this.form.querySelector('.js-form-errors');
    this.hideErrors();
    this.placeholders();
    this.bindFormEvents();
  }

  renderRegistrationExtra() {
    this.registrationExtraContainer.innerHTML = registrationExtraTmpl();
    this.registrationBasisFieldContainer = this.registrationExtraContainer.querySelector('.js-form-fieldset-radio');
    this.registrationBasisFieldContent = this.registrationExtraContainer.querySelector('.js-form-fieldset-radio-content');
    this.registrationBasisData = {
      proxy: {
        name: 'proxy',
        labelName: 'Данные о доверенности',
        labelDate: 'Дата доверенности'
      },
      charter: {
        name: 'charter',
        labelName: 'Данные об уставе',
        labelDate: 'Дата устава'
      }
    };
    this.bindInputEvents(this.registrationExtraContainer);

    this.renderRegistrationBasisField();
    this.bindRegistrationEvents();
  }

  renderRegistrationBasisField() {
    let selectedId = this.registrationBasisFieldContainer.querySelector('input[type="radio"]:checked').id;
    this.registrationBasisFieldContent.innerHTML = registrationBasisFieldTmpl(this.registrationBasisData[selectedId]);
    this.bindInputEvents(this.registrationBasisFieldContent);
  }

  bindFormEvents() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this.validateForm()) {
        this.formSubmit();
      }
    });

    if (this.isRegistration) {
      let showExtraButton = this.wrap.querySelector('.js-show-extra');
      showExtraButton.addEventListener('click', () => {
        this.renderRegistrationExtra();
      });
    }
  }

  bindRegistrationEvents() {
    const radioFieldset = this.wrap.querySelector('.js-form-fieldset-radio-inputs');
    const adressCopyLink = this.wrap.querySelector('.js-copy-link');

    radioFieldset.addEventListener('click', e => {
      if (e.target.classList.contains('js-radio-input')) {
        this.renderRegistrationBasisField();
      }
    });
    adressCopyLink.addEventListener('click', e => {
      this.registrationAdressCopyFields();
    });
  }

  registrationAdressCopyFields() {
    const adressLegal = this.wrap.querySelector('.js-adress-legal');
    const adressPost = this.wrap.querySelector('.js-adress-post');
    const adressLegalInputs = adressLegal.querySelectorAll('input');

    adressLegalInputs.forEach((input) => {
      let postInput = adressPost.querySelector(`#${input.id.replace(/legal/i, 'post')}`);
      if (input.value) {
        postInput.value = input.value;
        postInput.dispatchEvent(new Event('change'));
      }

    });
  }

  placeholders() {
    Array.prototype.forEach.call(this.fields, field => {
      this.bindInputEvents(field);
    });
  }

  bindInputEvents(field) {
    let inputs = field.querySelectorAll('input') || field.querySelectorAll('select');
    inputs.forEach((input) => {
      let placeholderValue = input.placeholder;
      input.dataset.placeholderValue = placeholderValue;

      input.addEventListener('blur', e => {
        input.placeholder = input.dataset.placeholderValue;
        if (input.value.length > 0) {
          input.parentNode.classList.add('_placeholder-on');
        } else {
          input.parentNode.classList.remove('_placeholder-on');
        }
      });

      input.addEventListener('focus', e => {
        input.placeholder = '';
        input.parentNode.classList.add('_placeholder-on');
      });

      input.addEventListener('change', e => {
        input.placeholder = '';
        input.parentNode.classList.add('_placeholder-on');
      });

      input.addEventListener('input', e => {
        input.parentNode.classList.remove('_invalid');
        input.parentNode.classList.remove('_wrong');
        input.parentNode.classList.add('_placeholder-on');
      });
    });
  }

  isNotValidInput(input) {
    return (!input.value || input.getAttribute('type') == "checkbox" && !input.checked);
  }

  isValidEmailInput(input) {
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return (filter.test(input.value));
  }

  validateForm() {
    let requiredInputs = this.wrap.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalid = null;

    Array.prototype.forEach.call(requiredInputs, input => {
      if (this.isNotValidInput(input)) {
        input.parentNode.classList.add('_invalid');
        input.parentNode.classList.remove('_wrong');
        isValid = false;
      } else {
        if (input.id === 'email') {
          if (this.isValidEmailInput(input)) {
            input.parentNode.classList.remove('_invalid');
            input.parentNode.classList.remove('_wrong');
          } else {
            input.parentNode.classList.add('_wrong');
            isValid = false;
          }
        } else {
          input.parentNode.classList.remove('_invalid');
          input.parentNode.classList.remove('_wrong');
        }
      }
      if (!isValid && !firstInvalid) {
        firstInvalid = input;
      }
    });

    if (firstInvalid) {
      smoothScroll(firstInvalid);
    }
    return isValid;
  }

  hideErrors() {
    if (this.errors) {
      Array.prototype.forEach.call(this.errors, error => {
        error.style.display = 'none';
      })
    }
  }

  formSubmit() {
    let elements = this.form.elements;
    let formData = {};
    let data;
    for (let i = 0; i < elements.length; ++i) {
      let element = elements[i];
      let name = element.name;
      let value = element.value;
      formData[name] = value;
    }

    data = {params: formData};

    if (this.form.id === 'contactForm') {
      document.body.classList.add('_loading');

      fetch("https://b2b.onetwotrip.com/api/contract-requests", {
        method: "POST",
        body: data
      })
        .then(response => {
          response.json().then((data) => {
            document.body.classList.remove('_loading');
            document.body.classList.add('_message-open');
            document.querySelector('.js-message-close').addEventListener(clickEvent, e => {
              document.body.classList.remove('_message-open');
            });
          })
        })
        .catch(function (error) {
          document.body.classList.remove('_loading');
          document.body.classList.add('_message-error-open');
          document.querySelector('.js-message-error-close').addEventListener(clickEvent, e => {
            document.body.classList.remove('_message-error-open');
          });
        });
    }
    /* params[name]:test name
     params[company]:test company
     params[phone]:test tel
     params[email]:test email
     params[contract_type]:corp
     params[agreed]:true
     */

    if (this.form.id === 'loginForm') {
      this.hideErrors();
      document.body.classList.add('_loading');
      fetch('/api/auth/login', {method: "POST", body: {login: data.login, password: data.password}})
        .then(response => {
          document.body.classList.remove('_loading');
          if (response.status == 'error') {
            this.errors.querySelector(`._${data.message}`).style.display = 'block';
          } else {
            window.location.replace("/account");
          }
        })
        .catch(function (error) {
          document.body.classList.remove('_loading');
          document.body.classList.add('_message-error-open');
          document.querySelector('.js-message-error-close').addEventListener(clickEvent, e => {
            document.body.classList.remove('_message-error-open');
          });
        })
    }
  }

};
