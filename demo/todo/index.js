import './index.css';
import 'skatejs-named-slots';
import kickflip, { emit, link } from '../../src/index';
import create, { button, form, input, p, slot, text } from '../../src/vdom';

const Xtodo = kickflip('x-todo', {
  events: {
    'list-add' (e) {
      const item = Xitem();
      item.textContent = e.detail;
      this.appendChild(item);
    },
    'item-remove' (e) {
      this.removeChild(e.detail);
    }
  },
  properties: {
    items: {
      default () {
        return [];
      }
    }
  },
  render () {
    create('x-list');
  }
});

const Xlist = kickflip('x-list', {
  events: {
    submit (e) {
      e.preventDefault();
      emit(this, 'list-add', { detail: this.value });
    }
  },
  properties: {
    value: { default: '' }
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
      emit(this, 'item-remove', { detail: this });
    }
  },
  render () {
    slot();
    text(' ');
    button('remove');
  }
});
