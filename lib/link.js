(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.link = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem) {
    var prop = arguments.length <= 1 || arguments[1] === undefined ? 'value' : arguments[1];

    return function (e) {
      elem[prop] = e.currentTarget.value;
    };
  };

  module.exports = exports['default'];
});