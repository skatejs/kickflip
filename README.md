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

http://jsbin.com/tataweq/1

```html
<x-hello>John</x-hello>
```

```js
kickflip.register('x-hello', {
  properties: {
    textContent: {}
  },
  render (elem, vdom) {
    return vdom.createElement('div', null, 'Hello, ', elem.textContent, '!');
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