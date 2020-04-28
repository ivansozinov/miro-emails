const Emails = (function () {
  this.init = function (options) {
    this.el = options.target;
    this.values = [];
    this.observers = [];

    this.el.classList.add('miro-emails');
    this.addInput();
  };

  this.pushObservers = () => {
    this.observers.forEach((f) => {
      f.call(null, this.values);
    });
  };

  this.insertValue = (value) => {
    this.values.push(value);
    this.pushObservers();
  };

  this.removeValue = (value) => {
    this.values.splice(this.values.findIndex((v) => v.name === value), 1);
    this.pushObservers();
  };

  this.clearValues = () => {
    this.values = [];
    this.pushObservers();
  };

  this.addInput = function () {
    const input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.setAttribute('placeholder', 'add more people…');
    input.classList.add('miro-emails__input');
    this.el.append(input);
    this.inputListeners(input);
    this.input = input;
  };

  this.inputListeners = (input) => {
    input.addEventListener('keypress', (evt) => {
      const charCode = evt.code;
      if ((charCode === 'Enter' || charCode === 'Comma') && input.value !== '') {
        evt.preventDefault();
        this.addItem(input.value);
        input.value = '';
      }
    });

    input.addEventListener('blur', () => {
      if (input.value !== '') {
        this.addItem(input.value);
        input.value = '';
      }
    });

    input.addEventListener('paste', (evt) => {
      evt.preventDefault();
      const paste = (evt.clipboardData || window.clipboardData).getData('text');
      const values = paste.split(',');
      values.forEach((value) => {
        this.addItem(value);
      });
      return false;
    });
  };

  this.insertRandomEmail = () => {
    this.addItem(`${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}@miro.com`);
  };

  this.sayMeEmailsCount = () => {
    alert(`Emails in input: ${this.values.length}`);
  };

  this.getAllEmails = () => this.values;

  this.replaceAllEmails = () => {
    const count = this.values.length;
    this.clearValues();
    const nodes = this.el.getElementsByTagName('span');
    for (let i = 0, len = nodes.length; i !== len; ++i) {
      nodes[0].parentNode.removeChild(nodes[0]);
    }
    for (let i = 0; i < count; i++) {
      this.insertRandomEmail();
    }
  };

  this.checkEmail = (email) => // https://emailregex.com/
    (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

  this.registerObserver = (callback) => {
    this.observers.push(callback);
  };

  this.addItem = (str) => {
    str.trim();
    const that = this;
    if (typeof this.values.find((v) => v.value === str) === 'undefined') {
      const span = document.createElement('span');
      span.classList.add('miro-emails__value');
      const newValue = {
        value: str,
      };
      span.innerHTML = str;
      if (this.checkEmail(str)) {
        span.classList.add('miro-emails__value_valid');
        newValue.valid = true;
      } else {
        span.classList.add('miro-emails__value_invalid');
        newValue.valid = false;
      }

      span.addEventListener('click', () => {
        that.removeValue(str);
        span.remove();
      });

      this.input.before(span);
      this.insertValue(newValue);
    } else {
      console.warn('Item already exists');
    }
  };
});

module.exports = (function () {
  return {
    create(options) {
      this.app = new Emails();
      this.app.init.call(this.app, options);
      return this.app;
    },
  };
}());
