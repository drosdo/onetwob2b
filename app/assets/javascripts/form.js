'use strict';
const smoothScroll = require('./smoothscroll.min');
require('es6-promise').polyfill();

let clickEvent;
if (window.navigator.pointerEnabled) clickEvent = 'pointerup';
else if ('ontouchend' in document.documentElement) clickEvent = 'touchend';
else clickEvent = 'click';
import registrationExtraTmpl from '_templates/form/registration-extra.pug';
import registrationBasisFieldTmpl from '_templates/form/registration-basis-field.pug';
import formMessageTmpl from '_templates/form/form-message.pug';
import formSuccessTmpl from '_templates/form/registration-success.pug';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.messages = {
      wrong: 'Неверный формат ввода',
      empty: 'Заполните поле'
    };
    this.isRegistration = options.data === 'registration';
    this.form = this.wrap.querySelector('form');
    if (this.isRegistration) {
      this.registrationExtraContainer = this.wrap.querySelector('.js-form-registration-extra');
      this.submitButton = this.wrap.querySelector('.js-submit-button');
      this.extraButton = this.wrap.querySelector('.js-show-extra');
    }
    this.fields = this.wrap.querySelectorAll('.js-form-field');
    this.errors = this.form.querySelector('.js-form-errors');
    this.hideErrors();
    this.initPlaceholders();
    this.bindFormEvents();
  }
/*
* форма регистрации подгружаемые поля
*
* */
  renderRegistrationExtra() {
    this.registrationExtraContainer.innerHTML = registrationExtraTmpl();
    this.registrationExtraContainer.classList.add('_full');
    this.extraButton.classList.add('g-hidden');
    this.submitButton.classList.remove('g-hidden');
    this.registrationBasisFieldContainer = this.registrationExtraContainer.querySelector('.js-form-fieldset-radio');
    this.registrationBasisFieldContent = this.registrationExtraContainer.querySelector('.js-form-fieldset-radio-content');
    this.registrationBasisData = [
      {
        name: 'proxy',
        labelName: 'Данные о доверенности',
        labelDate: 'Дата доверенности'
      },
      {
        name: 'charter',
        labelName: 'Данные об уставе',
        labelDate: 'Дата устава'
      }
    ];
    this.bindInputEvents(this.registrationExtraContainer);

    this.renderRegistrationBasisField();
    this.bindRegistrationEvents();
  }
  /*
	* форма регистрации: основание полномочий
	*
	* */
  renderRegistrationBasisField() {
    let selectedId = this.registrationBasisFieldContainer.querySelector('input[type="radio"]:checked').id;

    this.registrationBasisData.map((item) => {
      let container = this.wrap.querySelector(`.js-registration-basis-${item.name}`);
      container.innerHTML = registrationBasisFieldTmpl(item);
      if (selectedId === item.name) {
        container.classList.remove('g-hidden');
      }
    });
    this.bindInputEvents(this.registrationBasisFieldContent);
  }

  toggleRegistrationBasisField(name) {
    Array.prototype.forEach.call(this.wrap.querySelectorAll('.js-registration-basis'), (item) => {
      if (item.classList.contains(`js-registration-basis-${name}`)) {
        item.classList.remove('g-hidden');
      } else {
        item.classList.add('g-hidden');
      }
    });
  }

  /*
	* события
	*
	* */

  bindFormEvents() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this.validateForm()) {
        this.formSubmit();
      }
    });

    if (this.isRegistration) {
      this.extraButton.addEventListener('click', () => {
        this.renderRegistrationExtra();
      });
    }
  }

  bindRegistrationEvents() {
    const radioFieldset = this.wrap.querySelector('.js-form-fieldset-radio-inputs');
    const adressCopyLink = this.wrap.querySelector('.js-copy-link');

    radioFieldset.addEventListener('click', e => {
      if (e.target.classList.contains('js-radio-input')) {
        this.toggleRegistrationBasisField(e.target.id);
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

    Array.prototype.forEach.call(adressLegalInputs, (input) => {
      let postInput = adressPost.querySelector(`#${input.id.replace(/legal/i, 'post')}`);
      if (input.value) {
        postInput.value = input.value;
        postInput.placeholder = '';
        postInput.parentNode.classList.add('_placeholder-on');
      }
    });
  }

  initPlaceholders() {
    Array.prototype.forEach.call(this.fields, field => {
      this.bindInputEvents(field);
    });
  }

  bindInputEvents(field) {
    let inputs = field.querySelectorAll('input') || field.querySelectorAll('select');
    Array.prototype.forEach.call(inputs, (input) => {
      let placeholderValue = input.placeholder;
      input.dataset.placeholderValue = placeholderValue;

      input.addEventListener('blur', () => {
        input.placeholder = input.dataset.placeholderValue;
        if (input.value.length > 0) {
          input.parentNode.classList.add('_placeholder-on');
          if (input.id === 'email') {
            this.validateInput(input, 'email');
          }
        } else {
          input.parentNode.classList.remove('_placeholder-on');
        }
      });

      input.addEventListener('focus', () => {
        input.placeholder = '';
        input.parentNode.classList.add('_placeholder-on');
        this.setInputState(input, 'clean');
      });

      input.addEventListener('change', () => {
        input.placeholder = '';
        input.parentNode.classList.add('_placeholder-on');
      });

      input.addEventListener('input', () => {
        input.parentNode.classList.add('_placeholder-on');
        this.setInputState(input, 'clean');
        if (input.classList.contains('_numeric')) {
          this.validateInput(input, 'numeric');
        }
      });/*
      input.addEventListener('keypress', () => {

      });*/
    });
  }

  /* валидация формы */

  validateForm() {
    let requiredInputs = this.wrap.querySelectorAll('input[required]');
    let isFormValid = true;
    let firstInvalid = null;

    Array.prototype.forEach.call(requiredInputs, input => {
      let inputValidationResult;
      if (!input.closest('.g-hidden')) {
        inputValidationResult = this.validateInput(input);
        if (inputValidationResult !== 'good') {
          isFormValid = false;
          if (!firstInvalid) {
            firstInvalid = input;
          }
        }
      }
    });

    if (firstInvalid) {
      smoothScroll(firstInvalid);
    }

    return isFormValid;
  }


  validateInput(input, rule) {
    let inputValidationResult = 'good';
    let isCheckEmpty = rule ? rule === 'empty' : true;
    let isEmail = rule ? rule === 'email' : input.id === 'email' || input.classList.contains('js-input-email');
    let isNumeric = rule ? rule === 'numeric' : input.classList.contains('_numeric');

    if (this.isInputEmpty(input) && isCheckEmpty) {
      inputValidationResult = 'error';
    } else {
      if (isEmail && !this.isValidEmailInput(input)) {
        inputValidationResult = 'wrong';
      }
      if (isNumeric && !this.isValidNumericInput(input)) {
        inputValidationResult = 'wrong';
      }
    }
    this.setInputState(input, inputValidationResult);
    return inputValidationResult;
  }

  isInputEmpty(input) {
    return (!input.value || input.getAttribute('type') === 'checkbox' && !input.checked);
  }

  isValidEmailInput(input) {
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return (filter.test(input.value));
  }

  isValidNumericInput(input) {
    return (!isNaN(input.value));
  }

  setInputState(input, state) {
    let isError = state === 'error';
    let isWrong = state === 'wrong';
    let isClean = state === 'clean';

    if (isError) {
      input.parentNode.classList.add('_invalid');
      input.parentNode.classList.remove('_wrong');
      // this.showInputMessage(input, this.messages.empty);
    }

    if (isWrong) {
      input.parentNode.classList.remove('_invalid');
      input.parentNode.classList.add('_wrong');
      this.showInputMessage(input, this.messages.wrong);
    }

    if (isClean) {
      input.parentNode.classList.remove('_invalid');
      input.parentNode.classList.remove('_wrong');
      this.deleteInputMessage(input);
    }
  }

  showInputMessage(input, message) {
    let el = input.parentNode.querySelector('.js-form-message');

    if (el) {
      el.innerHTML = formMessageTmpl({ message });
    }
  }

  deleteInputMessage(input) {
    let el = input.parentNode.querySelector('.js-form-message');

    if (el) {
      el.innerHTML = '';
    }
  }


  hideErrors() {
    if (this.errors) {
      Array.prototype.forEach.call(this.errors, error => {
        error.style.display = 'none';
      });
    }
  }

  /*
	* SUBMIT
	* */

  formSubmit() {
    let elements = this.form.elements;
    let formData = {};
    let data;
    for (let i = 0; i < elements.length; ++i) {
      let element = elements[i];
      let name = element.name;
      let value = element.value;
      let type = element.type;
      let classList = element.classList;
      let checked = element.checked;

      if ((type === 'radio' && !checked) || classList.contains('js-not-send') || type === 'button' || name === '') {
        continue;
      }

      formData[name] = value;
    }

    data = { params: formData };

    if (this.form.id === 'contactForm') {
      document.body.classList.add('_loading');

      fetch('https://b2b.onetwotrip.com/api/contract-requests', {
        method: 'POST',
        body: data
      }).then(response => {
        response.json().then((data) => {
          document.body.classList.remove('_loading');
          document.body.classList.add('_message-open');
          document.querySelector('.js-message-close').addEventListener(clickEvent, e => {
            document.body.classList.remove('_message-open');
          });
        });
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
      fetch(
        '/api/auth/login', {
          method: 'POST',
          body: {
            login: data.login,
            password: data.password
          }
        }
      ).then(response => {
        document.body.classList.remove('_loading');
        if (response.status == 'error') {
          this.errors.querySelector(`._${data.message}`).style.display = 'block';
        } else {
          window.location.replace('/account');
        }
      }).catch(function(error) {
        document.body.classList.remove('_loading');
        document.body.classList.add('_message-error-open');
        document.querySelector('.js-message-error-close').addEventListener(
          clickEvent, () => {
            document.body.classList.remove('_message-error-open');
          }
        );
      });
    }

    if (this.form.id === 'registration') {
      document.body.classList.add('_loading');
      console.log(data)
      window.setTimeout(() => this.showFormCompletePage(formData), 1000);
    }
  }

  showFormCompletePage(data) {
    document.body.classList.remove('_loading');
    this.wrap.innerHTML = formSuccessTmpl(data);
    smoothScroll(0);
  }
};
