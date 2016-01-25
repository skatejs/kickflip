# Kickflip

Functional web components using [SkateJS](https://github.com/skatejs/skatejs) and [Virtual DOM](https://github.com/Matt-Esch/virtual-dom).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs).
- Uses native [custom element](http://w3c.github.io/webcomponents/spec/custom/) support if available.
- Functional rendering pipeline using [Virtual DOM](https://github.com/Matt-Esch/virtual-dom).

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

```js
import kickflip from 'kickflip';

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
