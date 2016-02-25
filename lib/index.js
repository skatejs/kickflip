(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './kickflip', './link', 'skatejs', './state', './vdom', './version'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./kickflip'), require('./link'), require('skatejs'), require('./state'), require('./vdom'), require('./version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.kickflip, global.link, global.skatejs, global.state, global.vdom, global.version);
    global.index = mod.exports;
  }
})(this, function (exports, _kickflip, _link, _skatejs, _state, _vdom, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.version = exports.vdom = exports.state = exports.render = exports.ready = exports.properties = exports.link = exports.init = exports.fragment = exports.emit = exports.create = undefined;

  var _kickflip2 = _interopRequireDefault(_kickflip);

  var _link2 = _interopRequireDefault(_link);

  var _skatejs2 = _interopRequireDefault(_skatejs);

  var _state2 = _interopRequireDefault(_state);

  var vdom = _interopRequireWildcard(_vdom);

  var _version2 = _interopRequireDefault(_version);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var create = _skatejs2.default.create;
  var emit = _skatejs2.default.emit;
  var fragment = _skatejs2.default.fragment;
  var init = _skatejs2.default.init;
  var properties = _skatejs2.default.properties;
  var ready = _skatejs2.default.ready;
  var render = _skatejs2.default.render;
  exports.default = _kickflip2.default;
  exports.create = create;
  exports.emit = emit;
  exports.fragment = fragment;
  exports.init = init;
  exports.link = _link2.default;
  exports.properties = properties;
  exports.ready = ready;
  exports.render = render;
  exports.state = _state2.default;
  exports.vdom = vdom;
  exports.version = _version2.default;
});