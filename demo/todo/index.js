import './index.css';
import 'skatejs-named-slots/src/index';
import kickflip, { emit, link } from '../../src/index';
import create, { button, form, input, p, slot, text } from '../../src/vdom';

const Xtodo = kickflip('x-todo', {
  events: {
    'todo-add' (e) {
      this.items = this.items.concat(e.detail);
      this.value = '';
    },
    'todo-remove' (e) {
      this.items = this.items.filter(item => item !== e.detail);
    }
  },
  properties: {
    items: {
      attribute: false,
      default () { return ['default item']; }
    },
    value: {
      default: ''
    }
  },
  render (elem) {
    create('x-list', { onchange: link(elem), value: elem.value }, function () {
      elem.items.forEach(function (val, key) {
        create('x-item', { key }, val);
      });
    });
  }
});

const Xlist = kickflip('x-list', {
  events: {
    submit (e) {
      e.preventDefault();
      emit(this, 'todo-add', { detail: this.value });
    }
  },
  properties: {
    value: {
      default: '',
      event: 'change'
    }
  },
  render (elem) {
    form(function () {
      input({ onkeyup: link(elem), value: elem.value });
      button({ type: 'submit' }, 'add');
    });
    slot(function () {
      p('There is nothing to do.');
    });
  }
});

const Xitem = kickflip('x-item', {
  events: {
    'click button' () {
      emit(this, 'todo-remove', { detail: this.textContent });
    }
  },
  render () {
    slot();
    text(' ');
    button('remove');
  }
});
