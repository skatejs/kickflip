(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'object-assign', 'skatejs/src/api/render'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('object-assign'), require('skatejs/src/api/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.objectAssign, global.render);
    global.state = mod.exports;
  }
})(this, function (exports, _objectAssign, _render) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem, newState) {
    return typeof newState === 'undefined' ? getState(elem) : setState(elem, newState);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _render2 = _interopRequireDefault(_render);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function getState(elem) {
    return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
      prev[curr] = elem[curr];
    }, {});
  }

  function setState(elem, newState) {
    var ctor = elem.constructor;
    var shouldUpdate = !ctor.update || ctor.update(elem) !== false;
    (0, _objectAssign2.default)(elem, newState);

    if (shouldUpdate) {
      (0, _render2.default)(elem);
    }
  }
});