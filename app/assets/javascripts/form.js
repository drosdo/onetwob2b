'use strict';

module.exports = class {
  constructor(options) {
    this.wrap = options.wrap;
    this.form = this.wrap.querySelector('form');
    this.fields = this.wrap.querySelectorAll('.js-form-field');
    this.placeholders();
    this.bindFormEvents();
  }
  bindFormEvents(){
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if(this.validateForm()){
       this.formSubmit();
      }
    })
  }

  placeholders() {
    Array.prototype.forEach.call(this.fields, field => {
      this.bindInputEvents(field);
    })
  }

  bindInputEvents(field) {
    let input = field.querySelector('input');
    let placeholderValue = input.placeholder;
    input.dataset.placeholderValue = placeholderValue;

    input.addEventListener('blur', e => {
      console.log('blur');
      input.placeholder = input.dataset.placeholderValue;
      if (input.value.length > 0) {
        field.classList.add('_placeholder-on');
      } else {
        field.classList.remove('_placeholder-on')
      }
    });

    input.addEventListener('focus', e => {
      console.log('focus');
      input.placeholder = '';
      field.classList.add('_placeholder-on');
    });

    input.addEventListener('input', e => {
      input.parentNode.classList.remove('_invalid');
      input.parentNode.classList.remove('_wrong');
      field.classList.add('_placeholder-on');
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

    Array.prototype.forEach.call(requiredInputs, input => {
      if(this.isNotValidInput(input)) {
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
    });

    return isValid;
  }

  formSubmit(){
    let elements = this.form.elements;
    let formData = {};
    let data;
    for( let i = 0; i < elements.length; ++i ) {
      let element = elements[i];
      let name = element.name;
      let value = element.value;
      formData[name] = value;
    }

    data = {params: formData};
    console.log(data);
      /* params[name]:test name
       params[company]:test company
       params[phone]:test tel
       params[email]:test email
       params[contract_type]:corp
       params[agreed]:true




       */
  }
};
