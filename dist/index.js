(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('object-assign'), require('skatejs'), require('virtual-dom/h'), require('virtual-dom/diff'), require('virtual-dom/patch'), require('virtual-dom/create-element'), require('skatejs/src/api/render')) :
  typeof define === 'function' && define.amd ? define(['object-assign', 'skatejs', 'virtual-dom/h', 'virtual-dom/diff', 'virtual-dom/patch', 'virtual-dom/create-element', 'skatejs/src/api/render'], factory) :
  (global.kickflip = factory(global.Object.assign,global.skate,global.virtualDom.h,global.virtualDom.diff,global.virtualDom.patch,global.virtualDom.createElement,global.skate.render));
}(this, function (assign,skate,h,diff,patch,createElement,render) {

  assign = 'default' in assign ? assign['default'] : assign;
  skate = 'default' in skate ? skate['default'] : skate;
  h = 'default' in h ? h['default'] : h;
  diff = 'default' in diff ? diff['default'] : diff;
  patch = 'default' in patch ? patch['default'] : patch;
  createElement = 'default' in createElement ? createElement['default'] : createElement;
  render = 'default' in render ? render['default'] : render;

  const mapOldTree = new WeakMap();
  const mapRootNode = new WeakMap();

  function render$1 (render) {
    return function (elem) {
      const newTree = render(elem, h);
      const oldTree = mapOldTree.get(elem);

      // Keep track of the previous state.
      mapOldTree.set(elem, newTree);

      // If the old tree exists, we're diffing / patching.
      // Otherwise we're doing the initial mount.
      if (oldTree) {
        patch(mapRootNode.get(elem), diff(oldTree, newTree));
      } else {
        const newRootNode = createElement(newTree);
        mapRootNode.set(elem, newRootNode);
        elem.appendChild(newRootNode);
      }
    };
  }

  function linkPropsToAttrsIfNotSpecified (props) {
    Object.keys(props || {}).forEach(function (name) {
      const prop = props[name];
      if (typeof prop.attribute === 'undefined') {
        prop.attribute = true;
      }
    });
  }

  function kickflip (name, opts) {
    linkPropsToAttrsIfNotSpecified(opts.properties);
    opts.render = render$1(opts.render);
    return skate(name, opts);
  }

  function getState (elem) {
    return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
      prev[curr] = elem[curr];
    }, {});
  }

  function setState(elem, newState) {
    const ctor = elem.constructor;
    const shouldUpdate = !ctor.update || ctor.update(elem) !== false;
    assign(elem, newState);
    if (shouldUpdate) {
      render(elem);
    }
  }

  function state (elem, newState) {
    return typeof newState === 'undefined' ? getState(elem) : setState(elem);
  }

  var main = assign(kickflip, { render: render$1, state });

  const previousGlobal = window.kickflip;
    main.noConflict = function noConflict () {
      window.kickflip = previousGlobal;
      return this;
    };
    window.kickflip = main;

  return main;

}));