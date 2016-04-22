(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './data', './util/debounce', './render', '../node_modules/skatejs/lib/index'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./data'), require('./util/debounce'), require('./render'), require('../node_modules/skatejs/lib/index'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data, global.debounce, global.render, global.index);
    global.kickflip = mod.exports;
  }
})(this, function (module, exports, _data, _debounce, _render, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, opts) {
    ensureOpts(opts);
    createAttributeLinks(name, opts);
    setStateOnPropertySet(opts);
    createEventProperties(opts);
    wrapRender(opts);
    return (0, _index2.default)(name, opts);
  };

  var _data2 = _interopRequireDefault(_data);

  var _debounce2 = _interopRequireDefault(_debounce);

  var _render2 = _interopRequireDefault(_render);

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var $debounce = Symbol();

  function createAttributeLinks(elem, opts) {
    var props = opts.properties;
    var tname = elem.toUpperCase();
    Object.keys(props).forEach(function (name) {
      var dataName = tname + '.' + name;
      var prop = props[name];
      _data2.default.applyProp[dataName] = true;

      if (!prop) {
        prop = props[name] = {};
      }

      if (typeof prop.attribute === 'undefined') {
        prop.attribute = true;
      }
    });
  }

  function createEventProperties(opts) {
    var props = opts.properties;
    opts.listeners.forEach(function (name) {
      props['on' + name] = {
        attribute: false,
        set: function set(elem, data) {
          if (data.newValue === data.oldValue) {
            return;
          }

          if (data.oldValue) {
            elem.removeEventListener(name, data.oldValue);
          }

          if (data.newValue) {
            elem.addEventListener(name, data.newValue);
          }
        }
      };
    });
  }

  function ensureOpts(opts) {
    if (!opts.listeners) {
      opts.listeners = [];
    }

    if (!opts.properties) {
      opts.properties = {};
    }

    if (!opts.slots) {
      opts.slots = [];
    }
  }

  function normalizePropertyRender(render) {
    if (typeof render === 'undefined') {
      return function (elem, data) {
        return data.newValue !== data.oldValue;
      };
    }

    if (typeof render === 'function') {
      return render;
    }

    return function () {
      return !!render;
    };
  }

  function setStateOnPropertySet(opts) {
    var props = opts.properties;
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
      var set = prop.set;
      var render = normalizePropertyRender(prop.render);

      prop.set = function (elem, data) {
        set && set(elem, data);

        if (render(elem, data)) {
          var deb = elem[$debounce];
          !deb && (deb = elem[$debounce] = (0, _debounce2.default)(_index2.default.render, 1));
          deb(elem);
        }
      };
    });
  }

  function wrapRender(opts) {
    opts.render = (0, _render2.default)(opts);
  }

  module.exports = exports['default'];
});