(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'object-assign', './api/kickflip', './api/render', './api/state'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('object-assign'), require('./api/kickflip'), require('./api/render'), require('./api/state'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.objectAssign, global.kickflip, global.render, global.state);
    global.index = mod.exports;
  }
})(this, function (exports, _objectAssign, _kickflip, _render, _state) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _kickflip2 = _interopRequireDefault(_kickflip);

  var _render2 = _interopRequireDefault(_render);

  var _state2 = _interopRequireDefault(_state);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _objectAssign2.default)(_kickflip2.default, { render: _render2.default, state: _state2.default });
});