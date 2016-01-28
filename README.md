# Kickflip

Kickflip gives you a simple, opinionated wrapper around Skate to write functional web components against [W3C specs](https://github.com/w3c/webcomponents).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs).
- Uses native [custom element](http://w3c.github.io/webcomponents/spec/custom/) support if available.
- Uni-directional rendering pipeline using [dom diffing / patching](https://github.com/skatejs-dom-diff).
- Public API exposed through partial-polyfilling of the [Shadow DOM Spec](https://w3c.github.io/webcomponents/spec/shadow/) using [named slots](https://github.com/skatejs/named-slots).



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

Here's some working examples of how to build web components with Kickflip.



### Hello

http://requirebin.com/?gist=2918047d70e7d90f945b

```html
<x-hello name="John"></x-hello>
```

```js
var kickflip = require('kickflip');
var div = kickflip.vdom.div;

kickflip('x-hello', {
  properties: {
    name: {}
  },
  render: function (elem) {
    return div('Hello, ', elem.name, '!');
  }
});
```



### Counter

http://requirebin.com/?gist=3991c87e28039497183d

```html
<x-counter></x-counter>
```

```js
var kickflip = require('kickflip');
var div = kickflip.vdom.div;
var state = kickflip.state;

var intervals = new WeakMap();

kickflip('x-counter', {
  properties: {
    count: { default: 0 }
  },
  attached: function (elem) {
    intervals.set(elem, setInterval(function () {
      state(elem, { count: elem.count + 1 });
    }, 1000));
  },
  detached: function (elem) {
    clearInterval(intervals.get(elem));
  },
  render: function (elem) {
    return div('Count: ', elem.count.toString());
  }
});
```



### Todos

http://requirebin.com/?gist=0ebbba5726766500eb33

```html
<x-todos>
  <x-item>Item 1</x-item>
  <x-item>Item 2</x-item>
  <x-item>Item 3</x-item>
</x-todos>
```

```js
var kickflip = require('kickflip');
var state = kickflip.state;
var vdom = kickflip.vdom;

var button = vdom.button;
var div = vdom.div;
var input = vdom.input;
var li = vdom.li;
var p = vdom.p;
var ul = vdom.ul;

kickflip('x-todos', {
  slots: ['content'],
  render: function (elem) {
    function add (e) {
      if (e.keyCode === 13) {
        state(elem, {
          content: elem.content.concat(vdom('x-item', e.target.value)),
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

    var items = elem.content.map(function (item, index) {
      return li(item, ' ', button({ onclick: remove(index) }, 'x'));
    });

    return div(
      input({ onkeyup: add, value: elem.value }),
      items.length ? ul(items) : p('There are no items.')
    );
  }
});
```



### React Integration

http://requirebin.com/?gist=451f1f4f94003e7af33f

The example above is the same `<x-todos>` component rendered by a React app. It exists to show the seamless integration between native (or polyfilled) custom elements and React components.
