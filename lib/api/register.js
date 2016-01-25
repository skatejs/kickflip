(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'skatejs-dom-diff/src/render', 'skatejs'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('skatejs-dom-diff/src/render'), require('skatejs'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.render, global.skatejs);
    global.register = mod.exports;
  }
})(this, function (exports, _render, _skatejs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, opts) {
    linkPropsToAttrsIfNotSpecified(opts.properties);
    opts.render = (0, _render2.default)(opts.render);
    return (0, _skatejs2.default)(name, opts);
  };

  var _render2 = _interopRequireDefault(_render);

  var _skatejs2 = _interopRequireDefault(_skatejs);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function linkPropsToAttrsIfNotSpecified(props) {
    Object.keys(props || {}).forEach(function (name) {
      var prop = props[name];

      if (typeof prop.attribute === 'undefined') {
        prop.attribute = true;
      }
    });
  }
});