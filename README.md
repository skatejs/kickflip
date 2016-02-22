# Kickflip

Kickflip gives you a simple, opinionated wrapper around Skate to write functional web components against [W3C specs](https://github.com/w3c/webcomponents).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs) that uses native Custom Element support if available.
- Uni-directional rendering pipeline using [dom diffing / patching] via Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Public API exposed through partial-polyfilling of the [Shadow DOM Spec](https://w3c.github.io/webcomponents/spec/shadow/) using [our Named Slot Prollyfill](https://github.com/skatejs/named-slots).
- Because we polyfill some of the DOM methods for the named-slot API, Kickflip is inherently compatible with libraries such as Incremental DOM, Virtual DOM and React.



## Install

Package managers:

```sh
bower install kickflip
jspm install npm:kickflip
npm install kickflip
```

- Global / UMD bundles are located in `dist/`.
- UMD sources are located in `lib/`.
- ES2015 modules are located in `src/`.



## Usage

Here's some examples of how to build web components with Kickflip.



### Hello

```html
<x-hello name="John"></x-hello>
```

```js
import kickflip from 'kickflip';
import { div } from 'kickflip/src/vdom';

kickflip('x-hello', {
  properties: {
    name: {}
  },
  render (elem) {
    div(`Hello ${elem.name}!`);
  }
});
```



### Counter

```html
<x-counter></x-counter>
```

```js
import kickflip from 'kickflip';
import { div } from 'kickflip/src/vdom';

var intervals = new WeakMap();

kickflip('x-counter', {
  properties: {
    count: { default: 0 }
  },
  attached: function (elem) {
    intervals.set(elem, setInterval(function () {
      ++elem.count;
    }, 1000));
  },
  detached: function (elem) {
    clearInterval(intervals.get(elem));
  },
  render (elem) {
    div(`Count: ${elem.count}`);
  }
});
```



### Todos

```html
<x-todo>
  <x-item>Item 1</x-item>
  <x-item>Item 2</x-item>
  <x-item>Item 3</x-item>
</x-todo>
```

```js
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
```
