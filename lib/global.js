(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../src/index.js'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../src/index.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.main);
    global.global = mod.exports;
  }
})(this, function (exports, module, _srcIndexJs) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _main = _interopRequireDefault(_srcIndexJs);

  var previousGlobal = window.kickflip;
  _main['default'].noConflict = function noConflict() {
    window.kickflip = previousGlobal;
    return this;
  };
  window.kickflip = _main['default'];

  module.exports = _main['default'];
});