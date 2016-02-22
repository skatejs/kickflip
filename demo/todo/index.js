import './index.css';
import kickflip, { emit, link, render } from '../../src/index';
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
  render (elem) {
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
    slot({ name: '' });
  }
});

const Xitem = kickflip('x-item', {
  events: {
    'click button' (e) {
      emit(this, 'item-remove', { detail: this });
    }
  },
  render () {
    slot({ name: '' });
    text(' ');
    button('remove');
  }
});
