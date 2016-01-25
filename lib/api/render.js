(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'virtual-dom/h', 'virtual-dom/diff', 'virtual-dom/patch', 'virtual-dom/create-element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('virtual-dom/h'), require('virtual-dom/diff'), require('virtual-dom/patch'), require('virtual-dom/create-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.h, global.diff, global.patch, global.createElement);
    global.render = mod.exports;
  }
})(this, function (exports, _h, _diff, _patch, _createElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (render) {
    return function (elem) {
      var newTree = render(elem, _h2.default);
      var oldTree = mapOldTree.get(elem);

      // Keep track of the previous state.
      mapOldTree.set(elem, newTree);

      // If the old tree exists, we're diffing / patching.
      // Otherwise we're doing the initial mount.
      if (oldTree) {
        (0, _patch2.default)(mapRootNode.get(elem), (0, _diff2.default)(oldTree, newTree));
      } else {
        var newRootNode = (0, _createElement2.default)(newTree);
        mapRootNode.set(elem, newRootNode);
        elem.appendChild(newRootNode);
      }
    };
  };

  var _h2 = _interopRequireDefault(_h);

  var _diff2 = _interopRequireDefault(_diff);

  var _patch2 = _interopRequireDefault(_patch);

  var _createElement2 = _interopRequireDefault(_createElement);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var mapOldTree = new WeakMap();
  var mapRootNode = new WeakMap();
});