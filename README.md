# Kickflip

Kickflip gives you a simple, opinionated wrapper around Skate to write functional web components against [W3C specs](https://github.com/w3c/webcomponents).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs).
- Uses native [custom element](http://w3c.github.io/webcomponents/spec/custom/) support if available.
- Uni-directional rendering pipeline using [dom diffing / patching](https://github.com/skatejs-dom-diff).
- Public API exposed through partial-polyfilling of the [Shadow DOM Spec](https://w3c.github.io/webcomponents/spec/shadow/) using [named slots](https://github.com/skatejs/named-slots).



## Install

Package managers (not published yet, but this is what it will look like):

```sh
bower install kickflip
jspm install npm:kickflip
npm install kickflip
```

- Global / UMD bundles are located in `dist/`.
- UMD sources are located in `lib/`.
- ES2015 modules are located in `src/`.



## Usage

Here's some working examples of how to build web components with Kickflip.



### Hello

http://jsbin.com/tataweq/2

```html
<x-hello name="John"></x-hello>
```

```js
import kickflip from 'kickflip/src/register';
import { div } from 'kickflip/src/vdom';

kickflip('x-hello', {
  properties: {
    name: {}
  },
  render (elem) {
    return div('Hello, ', elem.name, '!');
  }
});
```



### Counter

http://jsbin.com/cetidi/1

```html
<x-counter></x-counter>
```

```js
import kickflip, { state } from 'kickflip/src/register';
import { div } from 'kickflip/src/vdom';

const intervals = new WeakMap();

kickflip('x-counter', {
  properties: {
    count: { default: 0 }
  },
  attached (elem) {
    intervals.set(elem, setInterval(function () {
      state(elem, { count: elem.count + 1 });
    }, 1000));
  },
  detached (elem) {
    clearInterval(intervals.get(elem));
  },
  render (elem) {
    return div('Count: ', elem.count.toString());
  }
});
```



### Todos

http://jsbin.com/basego/3

```html
<x-todos>
  <x-item>Item 1</x-item>
  <x-item>Item 2</x-item>
  <x-item>Item 3</x-item>
</x-todos>
```

```js
import kickflip, { state } from 'kickflip';
import vdom, { button, div, li } from 'kickflip/src/vdom';

kickflip('x-todos', {
  slots: ['content'],
  render (elem) {
    function add (e) {
      if (e.keyCode === 13) {
        state(elem, {
          content: elem.content.concat(vdom('x-item', null, e.target.value)),
          value: ''
        });
      }
    }

    function remove (index) {
      return function () {
        state(elem, {
          content: elem.content.slice(0, index).concat(elem.content.slice(index + 1))
        });
      };
    }

    const items = elem.content.map(function (item, index) {
      return li(item, ' ', button({ onclick: remove(index) }, 'x'));
    });

    return div(
      input({ onkeyup: add, value: elem.value }),
      items.length ? ul(items) : p('There are no items.')
    );
  }
});
```
