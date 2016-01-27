(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './register', './state', './vdom', './version'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./register'), require('./state'), require('./vdom'), require('./version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.register, global.state, global.vdom, global.version);
    global.index = mod.exports;
  }
})(this, function (exports, _register, _state, _vdom, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.version = exports.vdom = exports.state = exports.register = undefined;

  var _register2 = _interopRequireDefault(_register);

  var _state2 = _interopRequireDefault(_state);

  var _vdom2 = _interopRequireDefault(_vdom);

  var _version2 = _interopRequireDefault(_version);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.register = _register2.default;
  exports.state = _state2.default;
  exports.vdom = _vdom2.default;
  exports.version = _version2.default;
  exports.default = _register2.default;
});