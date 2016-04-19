import './index.css';
import 'skatejs-named-slots';
import kickflip, { emit, link } from '../../src/index';
import create, { button, form, input, p, slot, text } from '../../src/vdom';

function sync (elem, target) {
  const func = link(elem, target);
  return function (e) {
    elem.value = e.detail.newValue;
  };
}

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
      default () { return []; }
    },
    value: {
      default: ''
    }
  },
  render (elem) {
    console.log(elem.value);
    create('x-list', { onchange: sync(elem), value: elem.value }, function () {
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
