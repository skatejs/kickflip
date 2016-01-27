(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './register', './state', './vdom'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./register'), require('./state'), require('./vdom'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.register, global.state, global.vdom);
    global.index = mod.exports;
  }
})(this, function (exports, _register, _state, _vdom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.vdom = exports.state = exports.register = undefined;

  var _register2 = _interopRequireDefault(_register);

  var _state2 = _interopRequireDefault(_state);

  var _vdom2 = _interopRequireDefault(_vdom);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.register = _register2.default;
  exports.state = _state2.default;
  exports.vdom = _vdom2.default;
  exports.default = _register2.default;
});