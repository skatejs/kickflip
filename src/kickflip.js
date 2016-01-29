import ddRender from 'skatejs-dom-diff/lib/render';
import nsRender from 'skatejs-named-slots/lib/render';
import nsSlot from 'skatejs-named-slots/lib/slot';
import skate from 'skatejs';
import skRender from 'skatejs/lib/api/render';

function createAttributeLinks (opts) {
  const props = opts.properties;
  Object.keys(props).forEach(function (name) {
    const prop = props[name];
    if (typeof prop.attribute === 'undefined') {
      prop.attribute = true;
    }
  });
}

function createEventProperties (opts) {
  const props = opts.properties;
  opts.listeners.forEach(function (name) {
    props[`on${name}`] = {
      attribute: false,
      set (elem, data) {
        if (data.newValue === data.oldValue) {
          return;
        }

        if (data.oldValue) {
          elem.removeEventListener(name, data.oldValue);
        }

        if (data.newValue) {
          elem.addEventListener(name, data.newValue);
        }
      }
    };
  });
}

function createSlotProperties (opts) {
  const props = opts.properties;
  opts.slots.forEach(function (name, index) {
    props[name] = nsSlot({
      attribute: false,
      default: index === 0,
      set: skRender
    });
  });
}

function ensureOpts (opts) {
  if (!opts.listeners) {
    opts.listeners = [];
  }
  if (!opts.properties) {
    opts.properties = {};
  }
  if (!opts.slots) {
    opts.slots = [];
  }
}

function wrapRender (opts) {
  opts.render = nsRender(ddRender(opts.render));
}

export default function (name, opts) {
  ensureOpts(opts);
  createAttributeLinks(opts);
  createEventProperties(opts);
  createSlotProperties(opts);
  wrapRender(opts);
  return skate(name, opts);
}
