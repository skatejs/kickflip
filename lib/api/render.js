(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'virtual-dom/h', 'virtual-dom/diff', 'virtual-dom/patch', 'virtual-dom/create-element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('virtual-dom/h'), require('virtual-dom/diff'), require('virtual-dom/patch'), require('virtual-dom/create-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.h, global.diff, global.patch, global.createElement);
    global.render = mod.exports;
  }
})(this, function (exports, module, _virtualDomH, _virtualDomDiff, _virtualDomPatch, _virtualDomCreateElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _h = _interopRequireDefault(_virtualDomH);

  var _diff = _interopRequireDefault(_virtualDomDiff);

  var _patch = _interopRequireDefault(_virtualDomPatch);

  var _createElement = _interopRequireDefault(_virtualDomCreateElement);

  var mapOldTree = new WeakMap();
  var mapRootNode = new WeakMap();

  module.exports = function (render) {
    return function (elem) {
      var newTree = render(elem, _h['default']);
      var oldTree = mapOldTree.get(elem);

      // Keep track of the previous state.
      mapOldTree.set(elem, newTree);

      // If the old tree exists, we're diffing / patching.
      // Otherwise we're doing the initial mount.
      if (oldTree) {
        (0, _patch['default'])(mapRootNode.get(elem), (0, _diff['default'])(oldTree, newTree));
      } else {
        var newRootNode = (0, _createElement['default'])(newTree);
        mapRootNode.set(elem, newRootNode);
        elem.appendChild(newRootNode);
      }
    };
  };
});