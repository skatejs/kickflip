(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'skatejs-dom-diff/lib/render', 'skatejs-named-slots/lib/render', 'skatejs-named-slots/lib/slot', 'skatejs', 'skatejs/lib/api/render'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('skatejs-dom-diff/lib/render'), require('skatejs-named-slots/lib/render'), require('skatejs-named-slots/lib/slot'), require('skatejs'), require('skatejs/lib/api/render'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.render, global.render, global.slot, global.skatejs, global.render);
    global.kickflip = mod.exports;
  }
})(this, function (module, exports, _render, _render3, _slot, _skatejs, _render5) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, opts) {
    ensureOpts(opts);
    createAttributeLinks(opts);
    createEventProperties(opts);
    createSlotProperties(opts);
    wrapRender(opts);
    return (0, _skatejs2.default)(name, opts);
  };

  var _render2 = _interopRequireDefault(_render);

  var _render4 = _interopRequireDefault(_render3);

  var _slot2 = _interopRequireDefault(_slot);

  var _skatejs2 = _interopRequireDefault(_skatejs);

  var _render6 = _interopRequireDefault(_render5);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
        set: _render6.default
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

  function wrapRender(opts) {
    opts.render = (0, _render4.default)((0, _render2.default)(opts.render));
  }

  module.exports = exports['default'];
});