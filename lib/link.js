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
    var prop = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    var getValue = arguments.length <= 2 || arguments[2] === undefined ? getInputValue : arguments[2];

    return function (e) {
      var input = e.currentTarget;
      var name = prop || input.name || 'value';
      (elem || input)[name] = getValue(input);
    };
  };

  function getInputValue(input) {
    if (input.type === 'checkbox') {
      return input.checked ? input.value || true : false;
    }

    if (input.type === 'radio') {
      return input.checked ? input.value : null;
    }

    return input.value;
  }

  module.exports = exports['default'];
});