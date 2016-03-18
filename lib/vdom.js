(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'incremental-dom', './data'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('incremental-dom'), require('./data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.incrementalDom, global.data);
    global.vdom = mod.exports;
  }
})(this, function (exports, _incrementalDom, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wbr = exports.video = exports.ul = exports.u = exports.track = exports.tr = exports.title = exports.time = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.template = exports.td = exports.tbody = exports.table = exports.sup = exports.summary = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.shadow = exports.select = exports.section = exports.script = exports.samp = exports.s = exports.ruby = exports.rtc = exports.rt = exports.rp = exports.q = exports.progress = exports.pre = exports.picture = exports.param = exports.p = exports.output = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.noframes = exports.noembed = exports.nobr = exports.nav = exports.multicol = exports.meter = exports.meta = exports.menuitem = exports.menu = exports.marquee = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.keygen = exports.kbd = exports.ins = exports.input = exports.img = exports.image = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.font = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.element = exports.dt = exports.dl = exports.div = exports.dialog = exports.dfn = exports.details = exports.del = exports.dd = exports.datalist = exports.data = exports.content = exports.command = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bgsound = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.IncrementalDOM = exports.text = undefined;
  exports.default = create;
  exports.slot = slot;

  var IncrementalDOM = _interopRequireWildcard(_incrementalDom);

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var

  // Could import these, but we have to import all of IncrementalDOM anyways so
  // so that we can export our configured IncrementalDOM.
  applyProp = IncrementalDOM.applyProp;
  var attr = IncrementalDOM.attr;
  var attributes = IncrementalDOM.attributes;
  var elementClose = IncrementalDOM.elementClose;
  var elementOpen = IncrementalDOM.elementOpen;
  var elementOpenEnd = IncrementalDOM.elementOpenEnd;
  var elementOpenStart = IncrementalDOM.elementOpenStart;
  var skip = IncrementalDOM.skip;
  var symbols = IncrementalDOM.symbols;
  var text = IncrementalDOM.text;


  // Specify an environment for iDOM in case we haven't yet.
  if (typeof process === 'undefined') {
    /* eslint no-undef: 0 */
    process = { env: { NODE_ENV: 'production' } };
  }

  var applyDefault = attributes[symbols.default];
  var factories = {};

  // Attributes that are not handled by Incremental DOM.
  attributes.key = attributes.skip = attributes.statics = function () {};

  // Attributes that *must* be set via a property on all elements.
  attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

  // Default attribute applicator.
  attributes[symbols.default] = function (element, name, value) {
    var dataName = element.tagName + '.' + name;
    if (_data2.default.applyProp[dataName]) {
      applyProp(element, name, value);
    } else {
      applyDefault(element, name, value);
    }
  };

  function applyEvent(eName) {
    return function (elem, name, value) {
      var events = elem.__events;

      if (!events) {
        events = elem.__events = {};
      }

      var eFunc = events[eName];

      // This ensures events never double up.
      if (eFunc) {
        elem.removeEventListener(eName, eFunc);
      }

      events[eName] = value;
      elem.addEventListener(eName, value);
    };
  }

  // Creates a factory and returns it.
  function bind(tname) {
    if (typeof tname === 'function') {
      tname = tname.id || tname.name;
    }

    return factories[tname] = function (attrs, chren) {
      if (attrs && (typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) === 'object') {
        elementOpenStart(tname, attrs.key, attrs.statics);
        for (var _a in attrs) {
          var val = attrs[_a];
          // Event binding using on* names.
          if (!attributes[_a] && _a.indexOf('on') === 0) {
            attributes[_a] = applyEvent(_a.substring(2));
            // Class attribute handling.
          } else if (_a === 'class') {
              _a = 'className';
              // False is not set at all.
            } else if (val === false) {
                continue;
              }
          attr(_a, val);
        }
        elementOpenEnd();
      } else {
        elementOpen(tname);
        chren = attrs;
        attrs = {};
      }

      if (attrs.skip) {
        skip();
      } else {
        var chrenType = typeof chren === 'undefined' ? 'undefined' : _typeof(chren);
        if (chrenType === 'function') {
          chren();
        } else if (chrenType === 'string' || chrenType === 'number') {
          text(chren);
        }
      }

      return elementClose(tname);
    };
  }

  // The default function requries a tag name.
  function create(tname, attrs, chren) {
    return (factories[tname] || bind(tname))(attrs, chren);
  }

  // Creates an element that acts as a slot.
  function slot(attrs, chren) {
    // Attributes must be an object so that we can add slot info.
    if (!attrs || (typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs)) !== 'object') {
      chren = attrs;
      attrs = {};
    }

    // Default to a <slot /> element.
    var tname = attrs.type || 'slot';

    // Always add a slot-name attribute, even if it's empty so that the named-
    // slot API can pick it up. We must also prepend a shadowId if there is one
    // so that the named-slot API only finds slot elements that belong to its
    // shadow root, not descendant component shadow roots.
    attrs['slot-name'] = _data2.default.shadowId + (attrs.name || '');

    // Since this is a slot we *must* skip it so that Incremental DOM doesn't
    // diff / patch the content of it.
    attrs.skip = true;

    // Ensure special attributes aren't passed on.
    delete attrs.name;
    delete attrs.type;

    return create(tname, attrs, chren);
  }

  // Export the Incremental DOM text() function directly as we don't need to do
  // any special processing for it.
  exports.text = text;
  exports.

  // We export IncrementalDOM in its entirety because we want the user to be able
  // to user our configured version while still being able to use various other
  // templating languages and techniques that compile down to it.
  IncrementalDOM = IncrementalDOM;


  // Create factories for all HTML elements except for ones that match keywords
  // such as "var".
  var a = exports.a = bind('a');
  var abbr = exports.abbr = bind('abbr');
  var address = exports.address = bind('address');
  var area = exports.area = bind('area');
  var article = exports.article = bind('article');
  var aside = exports.aside = bind('aside');
  var audio = exports.audio = bind('audio');
  var b = exports.b = bind('b');
  var base = exports.base = bind('base');
  var bdi = exports.bdi = bind('bdi');
  var bdo = exports.bdo = bind('bdo');
  var bgsound = exports.bgsound = bind('bgsound');
  var blockquote = exports.blockquote = bind('blockquote');
  var body = exports.body = bind('body');
  var br = exports.br = bind('br');
  var button = exports.button = bind('button');
  var canvas = exports.canvas = bind('canvas');
  var caption = exports.caption = bind('caption');
  var cite = exports.cite = bind('cite');
  var code = exports.code = bind('code');
  var col = exports.col = bind('col');
  var colgroup = exports.colgroup = bind('colgroup');
  var command = exports.command = bind('command');
  var content = exports.content = bind('content');
  var data = exports.data = bind('data');
  var datalist = exports.datalist = bind('datalist');
  var dd = exports.dd = bind('dd');
  var del = exports.del = bind('del');
  var details = exports.details = bind('details');
  var dfn = exports.dfn = bind('dfn');
  var dialog = exports.dialog = bind('dialog');
  var div = exports.div = bind('div');
  var dl = exports.dl = bind('dl');
  var dt = exports.dt = bind('dt');
  var element = exports.element = bind('element');
  var em = exports.em = bind('em');
  var embed = exports.embed = bind('embed');
  var fieldset = exports.fieldset = bind('fieldset');
  var figcaption = exports.figcaption = bind('figcaption');
  var figure = exports.figure = bind('figure');
  var font = exports.font = bind('font');
  var footer = exports.footer = bind('footer');
  var form = exports.form = bind('form');
  var h1 = exports.h1 = bind('h1');
  var h2 = exports.h2 = bind('h2');
  var h3 = exports.h3 = bind('h3');
  var h4 = exports.h4 = bind('h4');
  var h5 = exports.h5 = bind('h5');
  var h6 = exports.h6 = bind('h6');
  var head = exports.head = bind('head');
  var header = exports.header = bind('header');
  var hgroup = exports.hgroup = bind('hgroup');
  var hr = exports.hr = bind('hr');
  var html = exports.html = bind('html');
  var i = exports.i = bind('i');
  var iframe = exports.iframe = bind('iframe');
  var image = exports.image = bind('image');
  var img = exports.img = bind('img');
  var input = exports.input = bind('input');
  var ins = exports.ins = bind('ins');
  var kbd = exports.kbd = bind('kbd');
  var keygen = exports.keygen = bind('keygen');
  var label = exports.label = bind('label');
  var legend = exports.legend = bind('legend');
  var li = exports.li = bind('li');
  var link = exports.link = bind('link');
  var main = exports.main = bind('main');
  var map = exports.map = bind('map');
  var mark = exports.mark = bind('mark');
  var marquee = exports.marquee = bind('marquee');
  var menu = exports.menu = bind('menu');
  var menuitem = exports.menuitem = bind('menuitem');
  var meta = exports.meta = bind('meta');
  var meter = exports.meter = bind('meter');
  var multicol = exports.multicol = bind('multicol');
  var nav = exports.nav = bind('nav');
  var nobr = exports.nobr = bind('nobr');
  var noembed = exports.noembed = bind('noembed');
  var noframes = exports.noframes = bind('noframes');
  var noscript = exports.noscript = bind('noscript');
  var object = exports.object = bind('object');
  var ol = exports.ol = bind('ol');
  var optgroup = exports.optgroup = bind('optgroup');
  var option = exports.option = bind('option');
  var output = exports.output = bind('output');
  var p = exports.p = bind('p');
  var param = exports.param = bind('param');
  var picture = exports.picture = bind('picture');
  var pre = exports.pre = bind('pre');
  var progress = exports.progress = bind('progress');
  var q = exports.q = bind('q');
  var rp = exports.rp = bind('rp');
  var rt = exports.rt = bind('rt');
  var rtc = exports.rtc = bind('rtc');
  var ruby = exports.ruby = bind('ruby');
  var s = exports.s = bind('s');
  var samp = exports.samp = bind('samp');
  var script = exports.script = bind('script');
  var section = exports.section = bind('section');
  var select = exports.select = bind('select');
  var shadow = exports.shadow = bind('shadow');
  var small = exports.small = bind('small');
  var source = exports.source = bind('source');
  var span = exports.span = bind('span');
  var strong = exports.strong = bind('strong');
  var style = exports.style = bind('style');
  var sub = exports.sub = bind('sub');
  var summary = exports.summary = bind('summary');
  var sup = exports.sup = bind('sup');
  var table = exports.table = bind('table');
  var tbody = exports.tbody = bind('tbody');
  var td = exports.td = bind('td');
  var template = exports.template = bind('template');
  var textarea = exports.textarea = bind('textarea');
  var tfoot = exports.tfoot = bind('tfoot');
  var th = exports.th = bind('th');
  var thead = exports.thead = bind('thead');
  var time = exports.time = bind('time');
  var title = exports.title = bind('title');
  var tr = exports.tr = bind('tr');
  var track = exports.track = bind('track');
  var u = exports.u = bind('u');
  var ul = exports.ul = bind('ul');
  var video = exports.video = bind('video');
  var wbr = exports.wbr = bind('wbr');
});