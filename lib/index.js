(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', './api/kickflip', './api/render', './api/state'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('./api/kickflip'), require('./api/render'), require('./api/state'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.kickflip, global.render, global.state);
    global.index = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _apiKickflip, _apiRender, _apiState) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _kickflip = _interopRequireDefault(_apiKickflip);

  var _render = _interopRequireDefault(_apiRender);

  var _state = _interopRequireDefault(_apiState);

  module.exports = (0, _assign['default'])(_kickflip['default'], { render: _render['default'], state: _state['default'] });
});