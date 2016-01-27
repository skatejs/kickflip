(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'skatejs-dom-diff/lib/vdom/element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('skatejs-dom-diff/lib/vdom/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.element);
    global.vdom = mod.exports;
  }
})(this, function (module, exports, _element) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _element2 = _interopRequireDefault(_element);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _element2.default;
  module.exports = exports['default'];
});