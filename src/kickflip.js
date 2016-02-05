import ddRender from 'skatejs-dom-diff/lib/render';
import debounce from 'debounce';
import nsRender from 'skatejs-named-slots/lib/render';
import nsSlot from 'skatejs-named-slots/lib/slot';
import skate from 'skatejs';

const $debounce = Symbol();

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
      set: skate.render
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

function normalizePropertyRender (render) {
  if (typeof render === 'undefined') {
    return function (elem, data) {
      return data.newValue !== data.oldValue;
    }
  }
  if (typeof render === 'function') {
    return render;
  }
  return function () {
    return !!render;
  };
}

function setStateOnPropertySet (opts) {
  const props = opts.properties;
  Object.keys(props).forEach(function (name) {
    const prop = props[name];
    const set = prop.set;
    const render = normalizePropertyRender(prop.render);
    prop.set = function (elem, data) {
      set && set(elem, data);
      if (render(elem, data)) {
        let deb = elem[$debounce];
        !deb && (deb = elem[$debounce] = debounce(skate.render, 1));
        deb(elem);
      }
    };
  });
}

function wrapRender (opts) {
  opts.render = nsRender(ddRender(opts.render));
}

export default function (name, opts) {
  ensureOpts(opts);
  createAttributeLinks(opts);
  setStateOnPropertySet(opts);
  createEventProperties(opts);
  createSlotProperties(opts);
  wrapRender(opts);
  return skate(name, opts);
}
