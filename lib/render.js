(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'incremental-dom'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('incremental-dom'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.incrementalDom);
    global.render = mod.exports;
  }
})(this, function (module, exports, _incrementalDom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var internalRenderer = opts.render;

    if (!internalRenderer) {
      return;
    }

    return function (elem) {
      if (!elem.shadowRoot) {
        elem.attachShadow({ mode: 'open' });
      }
      (0, _incrementalDom.patch)(elem.shadowRoot, internalRenderer, elem);
    };
  };

  module.exports = exports['default'];
});