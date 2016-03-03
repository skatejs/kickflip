(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'incremental-dom', './data', 'skatejs-named-slots/lib/render'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('incremental-dom'), require('./data'), require('skatejs-named-slots/lib/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.incrementalDom, global.data, global.render);
    global.render = mod.exports;
  }
})(this, function (module, exports, _incrementalDom, _data, _render) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var internalRenderer = opts.render;

    if (!internalRenderer) {
      return;
    }

    // Keep the internal shadow ID static as this is used to locate the slots
    // that belong to the shadow root excluding any that may belong to descendant
    // components of the shadow root.
    var internalShadowId = ++shadowIdCount;

    return (0, _render2.default)(function (elem, shadowRoot) {
      // Record the current shadow ID so we can restore it.
      var shadowId = _data2.default.shadowId;

      // Set the new shadow ID so that the vDOM API can use it.
      _data2.default.shadowId = internalShadowId;

      // Patch once the shadow ID is set.
      (0, _incrementalDom.patch)(shadowRoot, internalRenderer, elem);

      // Restore to the previous ID so that any subsequent elements refer to the
      // proper scope.
      _data2.default.shadowId = shadowId;
    }, {
      shadowId: internalShadowId
    });
  };

  var _data2 = _interopRequireDefault(_data);

  var _render2 = _interopRequireDefault(_render);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var shadowIdCount = 0;
  module.exports = exports['default'];
});