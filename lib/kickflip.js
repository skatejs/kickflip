(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'skatejs-dom-diff/lib/render', 'debounce', 'skatejs-named-slots/lib/render', 'skatejs-named-slots/lib/slot', 'skatejs'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('skatejs-dom-diff/lib/render'), require('debounce'), require('skatejs-named-slots/lib/render'), require('skatejs-named-slots/lib/slot'), require('skatejs'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.render, global.debounce, global.render, global.slot, global.skatejs);
    global.kickflip = mod.exports;
  }
})(this, function (module, exports, _render, _debounce, _render3, _slot, _skatejs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, opts) {
    ensureOpts(opts);
    createAttributeLinks(opts);
    setStateOnPropertySet(opts);
    createEventProperties(opts);
    createSlotProperties(opts);
    wrapRender(opts);
    return (0, _skatejs2.default)(name, opts);
  };

  var _render2 = _interopRequireDefault(_render);

  var _debounce2 = _interopRequireDefault(_debounce);

  var _render4 = _interopRequireDefault(_render3);

  var _slot2 = _interopRequireDefault(_slot);

  var _skatejs2 = _interopRequireDefault(_skatejs);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var $debounce = Symbol();

  function createAttributeLinks(opts) {
    var props = opts.properties;
    Object.keys(props).forEach(function (name) {
      var prop = props[name];

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

  function createSlotProperties(opts) {
    var props = opts.properties;
    opts.slots.forEach(function (name, index) {
      props[name] = (0, _slot2.default)({
        attribute: false,
        default: index === 0,
        set: _skatejs2.default.render
      });
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
          !deb && (deb = elem[$debounce] = (0, _debounce2.default)(_skatejs2.default.render, 1));
          deb(elem);
        }
      };
    });
  }

  function wrapRender(opts) {
    opts.render = (0, _render4.default)((0, _render2.default)(opts.render));
  }

  module.exports = exports['default'];
});