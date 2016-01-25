import ddRender from 'skatejs-dom-diff/src/render';
import nsRender from 'skatejs-named-slots/src/render';
import nsSlot from 'skatejs-named-slots/src/slot';
import skate from 'skatejs';
import skRender from 'skatejs/src/api/render';

function linkPropsToAttrsIfNotSpecified (opts) {
  const props = opts.properties;
  Object.keys(props || {}).forEach(function (name) {
    const prop = props[name];
    if (typeof prop.attribute === 'undefined') {
      prop.attribute = true;
    }
  });
}

function createSlotProperties (opts) {
  if (!opts.slots) {
    opts.slots = [];
  }

  if (!opts.properties) {
    opts.properties = {};
  }

  const props = opts.properties;

  opts.slots.forEach(function (name, index) {
    props[name] = nsSlot({
      default: index === 0,
      set: skRender
    });
  });
}

function wrapRender (opts) {
  opts.render = nsRender(ddRender(opts.render));
}

export default function (name, opts) {
  linkPropsToAttrsIfNotSpecified(opts);
  createSlotProperties(opts);
  wrapRender(opts);
  return skate(name, opts);
}