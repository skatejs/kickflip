(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'skatejs-dom-diff/src/vdom/element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('skatejs-dom-diff/src/vdom/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.element);
    global.vdom = mod.exports;
  }
})(this, function (exports, _element) {
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
});