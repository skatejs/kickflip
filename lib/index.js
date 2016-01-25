(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './register', './state'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./register'), require('./state'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.register, global.state);
    global.index = mod.exports;
  }
})(this, function (exports, _register, _state) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _register2 = _interopRequireDefault(_register);

  var _state2 = _interopRequireDefault(_state);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    register: _register2.default,
    state: _state2.default
  };
});