(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../node_modules/skatejs/lib/index'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../node_modules/skatejs/lib/index'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.properties = mod.exports;
  }
})(this, function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.string = exports.number = exports.boolean = exports.array = undefined;

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var props = _index2.default.properties;
  var array = props.array;
  var boolean = props.boolean;
  var number = props.number;
  var string = props.string;
  exports.default = props;
  exports.array = array;
  exports.boolean = boolean;
  exports.number = number;
  exports.string = string;
});