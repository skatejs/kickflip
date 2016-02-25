(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'incremental-dom', 'skatejs-named-slots/lib/render'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('incremental-dom'), require('skatejs-named-slots/lib/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.incrementalDom, global.render);
    global.render = mod.exports;
  }
})(this, function (module, exports, _incrementalDom, _render) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var internalRenderer = opts.render;

    if (!internalRenderer) {
      return;
    }

    return (0, _render2.default)(function (elem, shadowRoot) {
      (0, _incrementalDom.patch)(shadowRoot, internalRenderer, elem);
    });
  };

  var _render2 = _interopRequireDefault(_render);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});