import data from './data';
import render from './render';
import skate from '../node_modules/skatejs/lib/index';

const $debounce = Symbol();

// Defaults all properties to be linked to an attribute unless explicitly
// specified.
function createAttributeLinks (elem, opts) {
  const props = opts.properties;
  const tname = elem.toUpperCase();
  Object.keys(props).forEach(function (name) {
    const dataName = tname + '.' + name;
    let prop = props[name];

    // Ensure virtual-DOM knows to set this as a property.
    data.applyProp[dataName] = true;

    if (!prop) {
      prop = props[name] = {};
    }

    if (typeof prop.attribute === 'undefined') {
      prop.attribute = true;
    }
  });
}

// Creates properties that add / remove event listeners. This is mostly for
// seemless integration with React.
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

// Normalises options to safe defaults.
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

// Creates a safe default for the render option for properties.
function normalizePropertyRender (render) {
  if (typeof render === 'undefined') {
    return function (elem, data) {
      return data.newValue !== data.oldValue;
    };
  }
  if (typeof render === 'function') {
    return render;
  }
  return function () {
    return !!render;
  };
}

// Re-renders the component when a property is set, debouncing it so that it is
// only rendered once on the tail end of consecutive subsequent property sets.
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

// Wraps the provided render function with our custom renderer that does all
// the diffing / patching.
function wrapRender (opts) {
  opts.render = render(opts);
}

// Proxies skate() ensuring everything is set up before the component is
// registered and returned.
export default function (name, opts) {
  ensureOpts(opts);
  createAttributeLinks(name, opts);
  setStateOnPropertySet(opts);
  createEventProperties(opts);
  wrapRender(opts);
  return skate(name, opts);
}
