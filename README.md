# Kickflip

Kickflip gives you a simple, opinionated wrapper around [Skate](https://github.com/skatejs/skatejs) to write functional web components against [W3C specs](https://github.com/w3c/webcomponents).

- Custom elements backed by [SkateJS](https://github.com/skatejs/skatejs) that uses native Custom Element support if available.
- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Public API exposed through partial-polyfilling of the [Shadow DOM Spec](https://w3c.github.io/webcomponents/spec/shadow/) using [our Named Slot Prollyfill](https://github.com/skatejs/named-slots).
- Because we polyfill the relevant DOM methods and properties for the named-slot API, Kickflip is inherently compatible with libraries such as Incremental DOM, Virtual DOM and React while still offering a native DOM API for consumers of your components.

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

## Examples

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
    slot();
  }
});

const Xitem = kickflip('x-item', {
  events: {
    'click button' (e) {
      emit(this, 'item-remove', { detail: this });
    }
  },
  render () {
    slot();
    text(' ');
    button('remove');
  }
});
```

## API

The Kickflip API exports the following from the Skate API:

- [`create`](https://github.com/skatejs/skatejs#create-componentname-elementproperties--)
- [`emit`](https://github.com/skatejs/skatejs#emit-element-eventname-eventoptions--)
- [`fragment`](https://github.com/skatejs/skatejs#fragment-almostanything)
- [`init`](https://github.com/skatejs/skatejs#init-elements)
- [`ready`](https://github.com/skatejs/skatejs#ready-elementorelements-callback-)
- [`render`](https://github.com/skatejs/skatejs#render-element)

On top of that, it provides several other API functions to bring Skate into a functional, named-slot world.

### `kickflip (name, opts)`

The main `kickflip()` function takes the same arguments as the `skate()` function, it just massages them to make using them a bit more streamlined and opinionated.

The behaviour of the following options are altered:

#### `opts.properties`

Properties are always linked to attributes (`attribute: true`) unless explicitly specified. Properties now accept a `render` option that tells the component whether or not it should re-render if the corresponding property is set. If a `function`, it should return whether or not setting the property should queue a `render()`. It receives the same information `set()` gets. You can also specify a `boolean` value.

#### `opts.render`

The `render()` function is wrapped so that it always creates a shadow root and renders using Incremental DOM.

### `link (element, propSpec)`

The `link()` function returns a function that you can bind as an event listener. The handler will take the event and propagte the changes back to the `element`. This essentially allows for 2-way data-binding but is safer as the propagation of the user input value back to the component element will trigger a re-render ensuring all dependent UI is up to date.

```js
import { string } from 'kickflip/src/properties';
import { input } from 'kickflip/src/vdom';
import kickflip, { link } from 'kickflip';

kickflip('my-input', function () {
  properties: {
    value: string()
  },
  render (elem) {
    input({ onchange: link(elem), type: 'text' });
  }
});
```

By default the `propSpec` defaults to `e.currentTarget.getAttribute('name')` or `"value"` which is why it wasn't specified in the example above. In the example above, it would set `value` on the component. If you were to give your input a name, it would use the name from the event `currentTarget` as the name that should be set. For example if you changed your input to read:

```js
input({ name: 'someValue', onchange: link(elem), type: 'text' });
```

Then instead of setting `value` on the component, it would set `someValue`.

You may explicitly set the property you would like to set by specifying a second argument to `link()`:

```js
link(elem, 'someValue')
```

The above link would set `someValue` on the component.

You can also use dot-notation to reach into objects. If you do this, the top-most object will trigger a re-render of the component.

```js
link(elem, 'obj.someValue')
```

In the above example, the `obj` property would trigger an update even though only the `someValue` sub-property was changed. This is so you don't have to worry about re-rendering.

You can even take this a step further and specify a sub-object to modify using the name of the `currentTarget` (or `value`, of course) if `propSpec` ends with a `.`. For example:

```js
input({ name: 'someValue', onchange: link(elem, 'obj.'), type: 'text' });
```

The above example would set `obj.someValue` because the name of the input was `someValue`. This doesn't look much different from the previous example, but this allows you to create a single link handler for use with multiple inputs:

```js
const linkage = link(elem, 'obj.');
input({ name: 'someValue1', onchange: linkage, type: 'text' });
input({ name: 'someValue2', onchange: linkage, type: 'checkbox' });
input({ name: 'someValue3', onchange: linkage, type: 'radio' });
select({ name: 'someValue4', onchange: linkage }, function () {
  option({ value: 1 }, 'Option 1');
  option({ value: 2 }, 'Option 2');
});
```

The above linkage would set:

- `obj.someValue1`
- `obj.someValue2`
- `obj.someValue3`
- `obj.someValue4`

### `properties`

#### `properties.render (elem, data)`

The property `render()` function is called before re-rendering the component. If must return `true` in order for a re-render to occur. If you specify a `boolean` instead of a function for this option, then `true` will always re-render and `false` will never re-render. This option defaults to `true`.

### `state (elem[, state])`

The `state` function is a getter or setter depending on if you specify the second `state` argument. If you do not provide `state`, then the current state of the component is returned. If you pass `state`, then the current state of the component is set. When you set state, each property is set which queues a re-render depending on if the properties have specified they want to re-render.

Component state is derived from the declared properties. It will only ever return properties that are defined in the `properties` object. However, when you set state, whatever state you specify will be set even if they're not declared in `properties`.

### `vdom`

Kickflip includes several helpers for creating virtual elements with Incremental DOM.

#### `vdom.create (elementName, attributesOrChildren, children)`

The `elementName` argument is the name of the element you want to create. This can be a string or function that has the `id` or `name` property set, which makes it compatible with any function as well as Skate component constructors (that use `id` because WebKit doesn't let you re-define `name`).

The `attributesOrChildren` argument is either an `object`, a `function` that will render the children for this element or a `string` if you only want to render a text node as the children.

The `children` argument is a `function` that will render the children of this element or a `string` if you are only rendering text.

```js
create('select', { name: 'my-select' }, function () {
  create('option', { value: 'myval' }, 'My Value');
});
```

#### Elements as Functions

The `vdom` API also exports functions for every HTML5 element. You could rewrite the above example using those instead:

```js
import { option, select } from 'kickflip/src/vdom';

select({ name: 'my-select' }, function () {
  option({ value: 'myval' }, 'My Value');
});
```

The `text()` function is also exported directly from Incremental DOM and you could use that if you wanted to instead of specifying as string:

```js
import { option, select, text } from 'kickflip/src/vdom';

select({ name: 'my-select' }, function () {
  option({ value: 'myval' }, function () {
    text('My Value');
  });
});
```

This is very useful if you need to render text with other elements as siblings, or do complex conditional rendering.

#### Named Slots

The `vdom` API exports a `slot()` function that will create a slot element to distribute Light DOM to.

```js
import { slot } from 'kickflip/src/vdom';

slot();
```

By default, it creates a `<slot />` element and sets the `slot-name` to an empty value. It uses `slot-name` instead of `name` because no browsers currently support the named-slot API natively and skatejs-named-slots uses that for [good reasons](https://github.com/skatejs/named-slots/#how) it specifies in its [README](https://github.com/skatejs/named-slots/). In the future we plan to make this use native if available and hope to make everything work without having to expose any implementation details.

If you want to specify a name for the slot, you can use the `name` option that will automatically be handled under the hood:

```js
slot({ name: 'my-content' });
```

If you want have a slot within a `<ul />`, browsers might not like that. To make that work all you have to do is specify a `type` for the slot:

```js
slot({ type: 'ul' });
```

This makes it so that light DOM can be distributed to the `<ul />`. This also works for tables and any other elements that may have odd content requirements that aren't compatible with named-slots without native support.

#### Special Attributes

Kickflip adds some opinionated behaviour to Incremental DOM.

##### `attrs.class`

We ensure that if you pass the `class` attribute, that it sets that via the `className` property.

##### `attrs.key`

This gives the virtual element a [`key`](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) that Incremental DOM uses to keep track of it for more efficient patches when dealing with arrays of items.

```js
ul(function () {
  li({ key: 0 });
  li({ key: 1 });
});
```

##### `attrs.on*`

Any attribute beginning with `on` will be bound to the event matching the part found after `on`. For example, if you specify `onclick`, the value will be bound to the `click` event of the element.

```js
button({ onclick: e => console.log(e) }, 'Click me!');
```

You can also bind to custom events:

```js
create('my-element', { onsomecustomevent: e => console.log(e) });
```

Events are added / removed using `addEventListener()` / `removeEventListener()` so they will fire for bubbling events.

##### `attrs.skip`

This tells Incremental DOM to skip the element that has this attribute. This is automatically applied when `slot()` is called as the slotted elements will be managed by the parent component, not by the current diff tree. Elements that have this attribute cannot have children.

This is also helpful when integrating with 3rd-party libraries that may mutate the DOM.

```js
div({ skip: true });
```

##### `attrs.statics`

This is an array that tells Incremental DOM which attributes should be considered [static](http://google.github.io/incremental-dom/#rendering-dom/statics-array).

```js
div({ statics: ['attr1', 'prop2'] });
```

##### Boolean Attributes

If you specify `false` as any attribute value, the attribute will not be added, it will simply be ignored.

### version

Returns the current version of Kickflip.

## JSX and other templating languages

The `vdom` module is provided for a simple way to write virtual DOM without having to add a build step to your project. If you don't want to do that, you can use any templating language that compiles down to Incremental DOM calls.

If you wanted to use JSX, for example, you'd have to add support for compiling JSX down to Incremental DOM calls. This can be doen using the following modules:

- https://github.com/thejameskyle/incremental-dom-react-helper
- https://github.com/jridgewell/babel-plugin-incremental-dom

Once that is set up, you may write a component using JSX. For example, a simple blog element may look something like:

```js
import { string } from 'kickflip/src/properties';
import { IncrementalDOM } from 'kickflip/src/vdom';
import kickflip from 'kickflip';

kickflip('my-element', {
  properties: {
    title: string()
  },
  render () {
    <div>
      <h1>{elem.title}</h1>
      <slot name="description" />
      <article>
        <slot />
      </article>
    </div>
  }
});
```

And it could be used like:

```html
<my-element title="Eggs">
  <p slot="description">Article description.</p>
  <p>Main paragraph 1.</p>
  <p>Main paragraph 2.</p>
</my-element>
```
