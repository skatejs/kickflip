(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './render', 'skatejs'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./render'), require('skatejs'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.render, global.skate);
    global.kickflip = mod.exports;
  }
})(this, function (exports, module, _render, _skatejs) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _render2 = _interopRequireDefault(_render);

  var _skate = _interopRequireDefault(_skatejs);

  function linkPropsToAttrsIfNotSpecified(props) {
    Object.keys(props || {}).forEach(function (name) {
      var prop = props[name];
      if (typeof prop.attribute === 'undefined') {
        prop.attribute = true;
      }
    });
  }

  module.exports = function (name, opts) {
    linkPropsToAttrsIfNotSpecified(opts.properties);
    opts.render = (0, _render2['default'])(opts.render);
    return (0, _skate['default'])(name, opts);
  };
});