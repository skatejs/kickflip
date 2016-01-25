# kickflip

Functional web components using [SkateJS](https://github.com/skatejs/skatejs) and [Virtual DOM](https://github.com/Matt-Esch/virtual-dom).

- Custom elements backed by SkateJS.
- Uses native custom element support if available.
- Functional rendering pipeline using `virtual-dom`.

```js
import { register, state } from 'kickflip';
import { properties } from 'skatejs';

const intervals = new WeakMap();

register('x-counter', {
  properties: {
    count: properties.number({ default: 0 })
  },
  attached (elem) {
    intervals.set(elem, setInterval(function () {
      state(elem, {
        count: elem.count + 1
      })
    }, 1000));
  },
  detached (elem) {
    clearInterval(intervals.get(elem));
  },
  render (props, create) {
    return create('div', ['Count: ', props.count]);
  }
});
```
