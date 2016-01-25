(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', 'skatejs/lib/api/render'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('skatejs/lib/api/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.render);
    global.state = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _skatejsLibApiRender) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _render = _interopRequireDefault(_skatejsLibApiRender);

  function getState(elem) {
    return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
      prev[curr] = elem[curr];
    }, {});
  }

  function setState(elem, newState) {
    var ctor = elem.constructor;
    var shouldUpdate = !ctor.update || ctor.update(elem) !== false;
    (0, _assign['default'])(elem, newState);
    if (shouldUpdate) {
      (0, _render['default'])(elem);
    }
  }

  module.exports = function (elem, newState) {
    return typeof newState === 'undefined' ? getState(elem) : setState(elem);
  };
});