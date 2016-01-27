(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './kickflip', './state', './vdom', './version'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./kickflip'), require('./state'), require('./vdom'), require('./version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.kickflip, global.state, global.vdom, global.version);
    global.index = mod.exports;
  }
})(this, function (module, exports, _kickflip, _state, _vdom, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _kickflip2 = _interopRequireDefault(_kickflip);

  var _state2 = _interopRequireDefault(_state);

  var _vdom2 = _interopRequireDefault(_vdom);

  var _version2 = _interopRequireDefault(_version);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _kickflip2.default.state = _state2.default;
  _kickflip2.default.vdom = _vdom2.default;
  _kickflip2.default.version = _version2.default;
  exports.default = _kickflip2.default;
  module.exports = exports['default'];
});