# Kickflip

Kickflip gives you a simple, opinionated wrapper around Skate to write functional web components against [W3C specs](https://github.com/w3c/webcomponents).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs).
- Uses native [custom element](http://w3c.github.io/webcomponents/spec/custom/) support if available.
- Uni-directional rendering pipeline using [SkateJS DOM Diff](https://github.com/skatejs-dom-diff).



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

Here's some working examples of how to build components with Kickflip.



### Hello

http://jsbin.com/tataweq/2

```html
<x-hello name="John"></x-hello>
```

```js
kickflip.register('x-hello', {
  properties: {
    name: {}
  },
  render (elem, vdom) {
    return vdom.createElement('div', null, 'Hello, ', elem.name, '!');
  }
});
```



### Counter

http://jsbin.com/cetidi/1

```html
<x-counter></x-counter>
```

```js
const intervals = new WeakMap();

kickflip.register('x-counter', {
  properties: {
    count: { default: 0 }
  },
  attached (elem) {
    intervals.set(elem, setInterval(function () {
      kickflip.state(elem, { count: elem.count + 1 });
    }, 1000));
  },
  detached (elem) {
    clearInterval(intervals.get(elem));
  },
  render (elem, vdom) {
    return vdom.createElement('div', null, ['Count: ', elem.count.toString()]);
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
kickflip.register('x-todos', {
  slots: ['content'],
  render (elem, vdom) {
    function add (e) {
      if (e.keyCode === 13) {
        kickflip.state(elem, {
          content: elem.content.concat(vdom.createElement('x-item', null, e.target.value)),
          value: ''
        });
      }
    }

    function remove (index) {
      return function () {
        kickflip.state(elem, {
          content: elem.content.slice(0, index).concat(elem.content.slice(index + 1))
        });
      };
    }

    const items = elem.content.map(function (item, index) {
      const delbtn = vdom.createElement('button', { onclick: remove(index) }, 'x');
      return vdom.createElement('li', null, [item, ' ', delbtn]);
    });

    return vdom.createElement('div', null, [
      vdom.createElement('input', { onkeyup: add, value: elem.value }),
      items.length ? vdom.createElement('ul', null, items) : vdom.createElement('p', null, 'There are no items.')
    ]);
  }
});
```
