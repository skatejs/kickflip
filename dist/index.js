(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.kickflip = factory());
}(this, function () {

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};
	babelHelpers;


	var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

	// Because weak map polyfills either are too big or don't use native if
	// available properly.

	var index$3 = 0;
	var prefix = '__WEAK_MAP_POLYFILL_';

	var WeakMap$1 = function () {
	  if (typeof WeakMap !== 'undefined') {
	    return WeakMap;
	  }

	  function Polyfill() {
	    this.key = prefix + index$3;
	    ++index$3;
	  }

	  Polyfill.prototype = {
	    get: function get(obj) {
	      return obj[this.key];
	    },
	    set: function set(obj, val) {
	      obj[this.key] = val;
	    }
	  };

	  return Polyfill;
	}();

	function classToString(obj) {
	  if (typeof obj === 'string') {
	    return obj;
	  }

	  if (Array.isArray(obj)) {
	    return obj.join(' ');
	  }

	  return Object.keys(obj).filter(function (key) {
	    return obj[key] ? key : false;
	  }).join(' ');
	}

	function styleToString(obj) {
	  if (typeof obj === 'string') {
	    return obj;
	  }

	  return Object.keys(obj).map(function (key) {
	    return key + ': ' + obj[key] + ';';
	  }).join(' ');
	}

	function getAccessor(node, name) {
	  if (name === 'class') {
	    return node.className;
	  } else if (name === 'style') {
	    return node.style.cssText;
	    // most things
	  } else if (name !== 'type' && name in node) {
	      return node[name];
	      // real DOM elements
	    } else if (node.getAttribute) {
	        return node.getAttribute(name);
	        // vDOM nodes
	      } else if (node.attributes && node.attributes[name]) {
	          return node.attributes[name].value;
	        }
	}

	function mapAccessor(node, name, value) {
	  if (name === 'class') {
	    node.className = classToString(value);
	  } else if (name === 'style') {
	    node.style = { cssText: styleToString(value) };
	  }
	}

	function removeAccessor(node, name) {
	  if (name === 'class') {
	    node.className = '';
	  } else if (name === 'style') {
	    node.style.cssText = '';
	    // most things
	  } else if (name !== 'type' && name in node) {
	      node[name] = '';
	      // real DOM elements
	    } else if (node.removeAttribute) {
	        node.removeAttribute(name);
	        // vDOM nodes
	      } else if (node.attributes) {
	          delete node.attributes[name];
	        }
	}

	function setAccessor(node, name, value) {
	  if (name === 'class') {
	    node.className = value;
	  } else if (name === 'style') {
	    node.style.cssText = value;
	    // most things
	  } else if (name !== 'type' && name in node || typeof value !== 'string') {
	      // We check if it's undefined or null because IE throws "invalid argument"
	      // errors for some types of properties. Essentially this is the same as
	      // removing the accessor.
	      node[name] = value == null ? '' : value;
	      // real DOM elements
	    } else if (node.setAttribute) {
	        node.setAttribute(name, value);
	        // vDOM nodes
	      } else if (node.attributes) {
	          node.attributes[node.attributes.length] = node.attributes[name] = { name: name, value: value };
	        }
	}

	function createTextNode(item) {
	  return {
	    nodeType: 3,
	    textContent: item
	  };
	}

	function separateData(obj) {
	  var attrs = {};
	  var events = {};
	  var node = {};
	  var attrIdx = 0;

	  for (var name in obj) {
	    var value = obj[name];

	    if (name.indexOf('on') === 0) {
	      events[name.substring(2)] = value;
	    } else {
	      attrs[attrIdx++] = attrs[name] = { name: name, value: value };
	      mapAccessor(node, name, value);
	    }
	  }

	  attrs.length = attrIdx;
	  return { attrs: attrs, events: events, node: node };
	}

	function ensureNodes(arr) {
	  var out = [];
	  arr.filter(Boolean).forEach(function (item) {
	    if (Array.isArray(item)) {
	      out = out.concat(ensureNodes(item));
	    } else if ((typeof item === 'undefined' ? 'undefined' : babelHelpers.typeof(item)) === 'object') {
	      out.push(item);
	    } else {
	      out.push(createTextNode(item));
	    }
	  });
	  return out;
	}

	function ensureTagName(name) {
	  return (typeof name === 'function' ? name.id || name.name : name).toUpperCase();
	}

	function isChildren(arg) {
	  return arg && (typeof arg === 'string' || Array.isArray(arg) || typeof arg.nodeType === 'number');
	}

	var createElement = function element(name) {
	  var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var isAttrsNode = isChildren(attrs);
	  var data = separateData(isAttrsNode ? {} : attrs);
	  var node = data.node;
	  node.nodeType = 1;
	  node.tagName = ensureTagName(name);
	  node.attributes = data.attrs;
	  node.events = data.events;

	  for (var _len = arguments.length, chren = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    chren[_key - 2] = arguments[_key];
	  }

	  node.childNodes = ensureNodes(isAttrsNode ? [attrs].concat(chren) : chren);
	  return node;
	}

	// Generate built-in factories.
	['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'bgsound', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
	  element[tag] = element.bind(null, tag);
	});

	var APPEND_CHILD = 1;
	var REMOVE_CHILD = 2;
	var REMOVE_ATTRIBUTE = 3;
	var REPLACE_CHILD = 4;
	var SET_ATTRIBUTE = 5;
	var SET_EVENT = 6;
	var TEXT_CONTENT = 8;

	function compareAttributes (src, dst) {
	  var srcAttrs = src.attributes;
	  var dstAttrs = dst.attributes;
	  var srcAttrsLen = (srcAttrs || 0) && srcAttrs.length;
	  var dstAttrsLen = (dstAttrs || 0) && dstAttrs.length;
	  var instructions = [];

	  // Bail early if possible.
	  if (!srcAttrsLen && !dstAttrsLen) {
	    return instructions;
	  }

	  // Merge attributes that exist in source with destination's.
	  for (var a = 0; a < srcAttrsLen; a++) {
	    var srcAttr = srcAttrs[a];
	    var srcAttrName = srcAttr.name;
	    var srcAttrValue = getAccessor(src, srcAttrName);
	    var dstAttr = dstAttrs[srcAttrName];
	    var dstAttrValue = getAccessor(dst, srcAttrName);

	    if (!dstAttr) {
	      instructions.push({
	        data: { name: srcAttrName },
	        destination: dst,
	        source: src,
	        type: REMOVE_ATTRIBUTE
	      });
	    } else if (srcAttrValue !== dstAttrValue) {
	      instructions.push({
	        data: { name: srcAttrName, value: dstAttrValue },
	        destination: dst,
	        source: src,
	        type: SET_ATTRIBUTE
	      });
	    }
	  }

	  // We only need to worry about setting attributes that don't already exist
	  // in the source.
	  for (var a = 0; a < dstAttrsLen; a++) {
	    var dstAttr = dstAttrs[a];
	    var dstAttrName = dstAttr.name;
	    var dstAttrValue = getAccessor(dst, dstAttrName);
	    var srcAttr = srcAttrs[dstAttrName];

	    if (!srcAttr) {
	      instructions.push({
	        data: { name: dstAttrName, value: dstAttrValue },
	        destination: dst,
	        source: src,
	        type: SET_ATTRIBUTE
	      });
	    }
	  }

	  return instructions;
	}

	var map = new WeakMap$1();

	function eventMap (elem) {
	  var events = map.get(elem);
	  events || map.set(elem, events = {});
	  return events;
	}

	function compareEvents (src, dst) {
	  var dstEvents = dst.events;
	  var srcEvents = eventMap(src);
	  var instructions = [];

	  // Remove any source events that aren't in the source before seeing if we
	  // need to add any from the destination.
	  if (srcEvents) {
	    for (var name in srcEvents) {
	      if (dstEvents[name] !== srcEvents[name]) {
	        instructions.push({
	          data: { name: name, value: undefined },
	          destination: dst,
	          source: src,
	          type: SET_EVENT
	        });
	      }
	    }
	  }

	  // After instructing to remove any old events, we then can instruct to add
	  // new events. This prevents the new events from being removed from earlier
	  // instructions.
	  if (dstEvents) {
	    for (var name in dstEvents) {
	      var value = dstEvents[name];
	      if (srcEvents[name] !== value) {
	        instructions.push({
	          data: { name: name, value: value },
	          destination: dst,
	          source: src,
	          type: SET_EVENT
	        });
	      }
	    }
	  }

	  return instructions;
	}

	function compareElement (src, dst) {
	  if (src.tagName === dst.tagName) {
	    return compareAttributes(src, dst).concat(compareEvents(src, dst));
	  }
	}

	function text (src, dst) {
	  if (src.textContent === dst.textContent) {
	    return [];
	  }

	  return [{
	    destination: dst,
	    source: src,
	    type: TEXT_CONTENT
	  }];
	}

	var NODE_COMMENT = 8;
	var NODE_ELEMENT = 1;
	var NODE_TEXT = 3;

	function compareNode (src, dst) {
	  var dstType = undefined,
	      srcType = undefined;

	  if (!dst || !src) {
	    return;
	  }

	  dstType = dst.nodeType;
	  srcType = src.nodeType;

	  if (dstType !== srcType) {
	    return;
	  } else if (dstType === NODE_ELEMENT) {
	    return compareElement(src, dst);
	  } else if (dstType === NODE_TEXT) {
	    return text(src, dst);
	  } else if (dstType === NODE_COMMENT) {
	    return text(src, dst);
	  }
	}

	var realNodeMap = new WeakMap$1();

	var _window$1 = window;
	var Node$2 = _window$1.Node;

	function realNode (node) {
	  return node instanceof Node$2 ? node : realNodeMap.get(node);
	}

	function diff() {
	  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var src = opts.source;
	  var dst = opts.destination;
	  var instructions = [];

	  if (!src || !dst) {
	    return [];
	  }

	  var srcChs = src.childNodes;
	  var dstChs = dst.childNodes;
	  var srcChsLen = srcChs ? srcChs.length : 0;
	  var dstChsLen = dstChs ? dstChs.length : 0;

	  for (var a = 0; a < dstChsLen; a++) {
	    var curSrc = srcChs[a];
	    var curDst = dstChs[a];

	    // If there is no matching destination node it means we need to remove the
	    // current source node from the source.
	    if (!curSrc) {
	      instructions.push({
	        destination: dstChs[a],
	        source: src,
	        type: APPEND_CHILD
	      });
	      continue;
	    } else {
	      // Ensure the real node is carried over even if the destination isn't used.
	      // This is used in the render() function to keep track of the real node
	      // that corresponds to a virtual node if a virtual tree is being used.
	      if (!(curDst instanceof Node)) {
	        realNodeMap.set(curDst, realNode(curSrc));
	      }
	    }

	    var nodeInstructions = compareNode(curSrc, curDst);

	    // If there are instructions (even an empty array) it means the node can be
	    // diffed and doesn't have to be replaced. If the instructions are falsy
	    // it means that the nodes are not similar (cannot be changed) and must be
	    // replaced instead.
	    if (nodeInstructions) {
	      var newOpts = opts;
	      newOpts.destination = curDst;
	      newOpts.source = curSrc;
	      instructions = instructions.concat(nodeInstructions, diff(newOpts));
	    } else {
	      instructions.push({
	        destination: curDst,
	        source: curSrc,
	        type: REPLACE_CHILD
	      });
	    }
	  }

	  if (dstChsLen < srcChsLen) {
	    for (var a = dstChsLen; a < srcChsLen; a++) {
	      instructions.push({
	        destination: srcChs[a],
	        source: src,
	        type: REMOVE_CHILD
	      });
	    }
	  }

	  return instructions;
	}

	function createElement$1(el) {
	  var realNode = document.createElement(el.tagName);
	  var attributes = el.attributes;
	  var events = el.events;
	  var eventHandlers = eventMap(realNode);
	  var children = el.childNodes;

	  if (attributes) {
	    var attributesLen = attributes.length;
	    for (var a = 0; a < attributesLen; a++) {
	      var attr = attributes[a];
	      setAccessor(realNode, attr.name, attr.value);
	    }
	  }

	  if (events) {
	    for (var name in events) {
	      realNode.addEventListener(name, eventHandlers[name] = events[name]);
	    }
	  }

	  if (children) {
	    var docfrag = document.createDocumentFragment();
	    var childrenLen = children.length;

	    for (var a = 0; a < childrenLen; a++) {
	      var ch = children[a];
	      ch && docfrag.appendChild(render$1(ch));
	    }

	    if (realNode.appendChild) {
	      realNode.appendChild(docfrag);
	    }
	  }

	  return realNode;
	}

	function createText(el) {
	  return document.createTextNode(el.textContent);
	}

	function render$1(el) {
	  if (el instanceof Node) {
	    return el;
	  }
	  if (Array.isArray(el)) {
	    var _ret = function () {
	      var frag = document.createDocumentFragment();
	      el.forEach(function (item) {
	        return frag.appendChild(render$1(item));
	      });
	      return {
	        v: frag
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
	  }
	  var realNode = el.tagName ? createElement$1(el) : createText(el);
	  realNodeMap.set(el, realNode);
	  return realNode;
	}

	function appendChild (src, dst) {
	  realNode(src).appendChild(render$1(dst));
	}

	function removeAttribute (src, dst, data) {
	  removeAccessor(realNode(src), data.name);
	}

	function removeChild (src, dst) {
	  var realDst = realNode(dst);
	  realDst.parentNode.removeChild(realDst);
	}

	function replaceChild (src, dst) {
	  var realSrc = realNode(src);
	  realSrc && realSrc.parentNode && realSrc.parentNode.replaceChild(render$1(dst), realSrc);
	}

	function setAttribute (src, dst, data) {
	  setAccessor(realNode(src), data.name, data.value);
	}

	function setEvent (src, dst, data) {
	  var realSrc = realNode(src);
	  var eventHandlers = eventMap(realSrc);
	  var name = data.name;
	  var prevHandler = eventHandlers[name];
	  var nextHandler = data.value;

	  if (typeof prevHandler === 'function') {
	    delete eventHandlers[name];
	    realSrc.removeEventListener(name, prevHandler);
	  }

	  if (typeof nextHandler === 'function') {
	    eventHandlers[name] = nextHandler;
	    realSrc.addEventListener(name, nextHandler);
	  }
	}

	function textContent (src, dst) {
	  realNode(src).textContent = dst.textContent;
	}

	var patchers = {};
	patchers[APPEND_CHILD] = appendChild;
	patchers[REMOVE_ATTRIBUTE] = removeAttribute;
	patchers[REMOVE_CHILD] = removeChild;
	patchers[REPLACE_CHILD] = replaceChild;
	patchers[SET_ATTRIBUTE] = setAttribute;
	patchers[SET_EVENT] = setEvent;
	patchers[TEXT_CONTENT] = textContent;

	function patch(instruction) {
	  patchers[instruction.type](instruction.source, instruction.destination, instruction.data);
	}

	function patch$1 (instructions) {
	  instructions.forEach(patch);
	}

	function merge (opts) {
	  var inst = diff(opts);
	  patch$1(inst);
	  return inst;
	}

	function removeChildNodes(elem) {
	  while (elem.firstChild) {
	    var first = elem.firstChild;
	    first.parentNode.removeChild(first);
	  }
	}

	function mount (elem, tree) {
	  removeChildNodes(elem);
	  elem.appendChild(render$1(tree));
	}

	var _window = window;
	var Node$1 = _window.Node;

	var oldTreeMap = new WeakMap$1();

	function ddRender (render) {
	  return function (elem) {
	    elem = elem instanceof Node$1 ? elem : this;

	    if (!elem instanceof Node$1) {
	      throw new Error('No node provided to diff renderer as either the first argument or the context.');
	    }

	    // Create a new element to house the new tree since we diff / mount fragments.
	    var newTree = createElement('div', null, render(elem));
	    var oldTree = oldTreeMap.get(elem);

	    if (oldTree) {
	      merge({
	        destination: newTree,
	        source: oldTree
	      });
	    } else {
	      mount(elem, newTree.childNodes);
	    }

	    oldTreeMap.set(elem, newTree);
	  };
	}

	var mapPatch = new WeakMap();

	var mapSlots = new WeakMap();

	var mapSlotsDefault = new WeakMap();

	// Returns whether or not the specified element has been polyfilled.
	function polyfilled (elem) {
	  return mapPatch.get(elem);
	}

	var prop = Object.defineProperty.bind(Object);

	// Helpers.

	function getSlotName(elem, node) {
	  return node.getAttribute && node.getAttribute('slot') || mapSlotsDefault.get(elem);
	}

	function nodeToArray(node) {
	  return node instanceof DocumentFragment ? [].slice.call(node.childNodes) : [node];
	}

	// Prop overrides.

	var props = {
	  childElementCount: {
	    get: function get() {
	      return this.children.length;
	    }
	  },
	  childNodes: {
	    get: function get() {
	      var _this = this;

	      return (mapSlots.get(this) || []).reduce(function (prev, curr) {
	        return prev.concat(_this[curr]);
	      }, []);
	    }
	  },
	  children: {
	    get: function get() {
	      return this.childNodes.filter(function (node) {
	        return node.nodeType === 1;
	      });
	    }
	  },
	  firstChild: {
	    get: function get() {
	      return this.childNodes[0];
	    }
	  },
	  firstElementChild: {
	    get: function get() {
	      return this.children[0];
	    }
	  },
	  innerHTML: {
	    get: function get() {
	      return this.childNodes.map(function (node) {
	        return node.outerHTML || node.textContent;
	      }).join('');
	    },
	    set: function set(val) {
	      var div = document.createElement('div');
	      div.innerHTML = val;
	      while (div.hasChildNodes()) {
	        this.appendChild(div.childNodes[0]);
	      }
	    }
	  },
	  lastChild: {
	    get: function get() {
	      var ch = this.childNodes;
	      return ch[ch.length - 1];
	    }
	  },
	  lastElementChild: {
	    get: function get() {
	      var ch = this.children;
	      return ch[ch.length - 1];
	    }
	  },
	  outerHTML: {
	    get: function get() {
	      var name = this.tagName.toLowerCase();
	      var attributes = [].slice.call(this.attributes).map(function (attr) {
	        return ' ' + attr.name + (attr.value ? '=' + attr.value : '');
	      });
	      return '<' + name + attributes + '>' + this.innerHTML + '</' + name + '>';
	    }
	  },
	  textContent: {
	    get: function get() {
	      return this.childNodes.map(function (node) {
	        return node.textContent;
	      }).join('');
	    },
	    set: function set(val) {
	      var slot = mapSlotsDefault.get(this);
	      if (slot) {
	        this[slot] = document.createTextNode(val);
	      }
	    }
	  }
	};

	// Method overrides.

	var funcs = {
	  appendChild: function appendChild(newNode) {
	    var name = getSlotName(this, newNode);
	    if (!name && !this[name]) return;
	    this[name] = this[name].concat(nodeToArray(newNode));
	    return newNode;
	  },
	  hasChildNodes: function hasChildNodes() {
	    return this.childNodes.length > 0;
	  },
	  insertBefore: function insertBefore(newNode, refNode) {
	    var name = getSlotName(this, newNode);
	    if (!name || !this[name]) return;
	    var index = this[name].indexOf(refNode);
	    this[name] = this[name].slice(0, index).concat(nodeToArray(newNode)).concat(this[name].slice(index));
	    return newNode;
	  },
	  removeChild: function removeChild(refNode) {
	    var name = getSlotName(this, refNode);
	    if (!name && !this[name]) return;
	    var index = this[name].indexOf(refNode);
	    this[name] = this[name].slice(0, index).concat(this[name].slice(index + 1));
	    return refNode;
	  },
	  replaceChild: function replaceChild(newNode, refNode) {
	    var name = getSlotName(this, newNode);
	    if (!name || !this[name]) return;
	    var index = this[name].indexOf(refNode);
	    this[name] = this[name].slice(0, index).concat(nodeToArray(newNode)).concat(this[name].slice(index + 1));
	    return refNode;
	  }
	};

	// Polyfills an element.
	function polyfill (elem) {
	  if (polyfilled(elem)) {
	    return;
	  }

	  for (var name in props) {
	    prop(elem, name, props[name]);
	  }

	  for (var name in funcs) {
	    elem[name] = funcs[name];
	  }

	  mapPatch.set(elem, true);
	}

	// Simple renderer that proxies another renderer. It will polyfill if not yet
	// polyfilled, or simply run the renderer. Initial content is taken into
	// consideration.
	function nsRender (fn) {
	  return function (elem) {
	    if (mapPatch.get(elem)) {
	      fn(elem);
	    } else {
	      fn(elem);
	      polyfill(elem);
	    }
	  };
	}

	// Creates a slot property compatible with the SkateJS custom property
	// definitions. Makes web component integration much simpler.
	function nsSlot (opts) {
	  if (!opts) {
	    opts = {
	      default: false,
	      set: null
	    };
	  }

	  return {
	    // Makes sure that whatever is passed in is an array.
	    coerce: function coerce(val) {
	      return Array.isArray(val) ? val : [val];
	    },

	    // Registers the slot so we can check later.
	    created: function created(elem, data) {
	      var slots = mapSlots.get(elem);

	      if (!slots) {
	        mapSlots.set(elem, slots = []);
	      }

	      slots.push(data.name);

	      if (opts.default) {
	        mapSlotsDefault.set(elem, data.name);
	      }
	    },

	    // If an empty value is passed in, ensure that it's an array.
	    'default': function _default() {
	      return [];
	    },

	    // Return any initial nodes that match the slot.
	    initial: function initial(elem, data) {
	      return [].slice.call(elem.childNodes).filter(function (ch) {
	        if (ch.getAttribute) {
	          var slot = ch.getAttribute('slot') || opts.default && data.name;
	          return slot === data.name;
	        }
	      });
	    },

	    // User-defined setter.
	    set: opts.set
	  };
	}

	var validCustomElement = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.validCustomElement = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (name) {
	    var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];

	    return name.indexOf('-') > 0 && name.toLowerCase() === name && reservedNames.indexOf(name) < 0;
	  };
	});
	});

	var require$$0 = (validCustomElement && typeof validCustomElement === 'object' && 'default' in validCustomElement ? validCustomElement['default'] : validCustomElement);

	var ignored = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.ignored = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (element) {
	    var attrs = element.attributes;
	    return attrs && !!attrs['data-skate-ignore'];
	  };
	});
	});

	var require$$0$5 = (ignored && typeof ignored === 'object' && 'default' in ignored ? ignored['default'] : ignored);

	var walkTree = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './ignored'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$5);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.ignored);
	    global.walkTree = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _ignored) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _ignored2 = _interopRequireDefault(_ignored);

	  var Node = window.Node;

	  function walk(elem, fn) {
	    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2['default'])(elem)) {
	      return;
	    }

	    var chren = elem.childNodes;
	    var child = chren && chren[0];

	    fn(elem);
	    while (child) {
	      walk(child, fn);
	      child = child.nextSibling;
	    }
	  }

	  module.exports = function (elems, fn) {
	    if (!elems) {
	      return;
	    }

	    if (elems instanceof Node) {
	      elems = [elems];
	    }

	    for (var a = 0; a < elems.length; a++) {
	      walk(elems[a], fn);
	    }
	  };
	});
	});

	var require$$0$1 = (walkTree && typeof walkTree === 'object' && 'default' in walkTree ? walkTree['default'] : walkTree);

	var defineProperties = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.defineProperties = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (obj, props) {
	    Object.keys(props).forEach(function (name) {
	      var prop = props[name];
	      var descrptor = Object.getOwnPropertyDescriptor(obj, name);
	      var isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
	      var isConfigurable = !descrptor || descrptor.configurable;

	      if (isConfigurable) {
	        Object.defineProperty(obj, name, prop);
	      } else if (isDinosaurBrowser) {
	        obj[name] = prop.value;
	      }
	    });
	  };
	});
	});

	var require$$1 = (defineProperties && typeof defineProperties === 'object' && 'default' in defineProperties ? defineProperties['default'] : defineProperties);

	var debounce = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.debounce = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = function (fn) {
	    var called = false;

	    return function () {
	      var _this = this;

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      if (!called) {
	        called = true;
	        setTimeout(function () {
	          called = false;
	          fn.apply(_this, args);
	        }, 1);
	      }
	    };
	  };
	});
	});

	var require$$3$1 = (debounce && typeof debounce === 'object' && 'default' in debounce ? debounce['default'] : debounce);

	var getOwnPropertyDescriptors = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.getOwnPropertyDescriptors = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = function (obj) {
	    return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
	      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	      return prev;
	    }, {});
	  };
	});
	});

	var require$$0$2 = (getOwnPropertyDescriptors && typeof getOwnPropertyDescriptors === 'object' && 'default' in getOwnPropertyDescriptors ? getOwnPropertyDescriptors['default'] : getOwnPropertyDescriptors);

	var protos = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.protos = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = function (proto) {
	    var chains = [];
	    while (proto) {
	      chains.push(proto);
	      proto = Object.getPrototypeOf(proto);
	    }
	    chains.reverse();
	    return chains;
	  };
	});
	});

	var require$$2 = (protos && typeof protos === 'object' && 'default' in protos ? protos['default'] : protos);

	var getAllPropertyDescriptors = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './get-own-property-descriptors', './protos'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$2, require$$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.getOwnPropertyDescriptors, global.protos);
	    global.getAllPropertyDescriptors = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _getOwnPropertyDescriptors, _protos) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

	  var _protos2 = _interopRequireDefault(_protos);

	  module.exports = function (obj) {
	    return (0, _protos2['default'])(obj).reduce(function (result, proto) {
	      var descriptors = (0, _getOwnPropertyDescriptors2['default'])(proto);
	      Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
	        result[name] = descriptors[name];
	        return result;
	      }, result);
	      return result;
	    }, {});
	  };
	});
	});

	var require$$5 = (getAllPropertyDescriptors && typeof getAllPropertyDescriptors === 'object' && 'default' in getAllPropertyDescriptors ? getAllPropertyDescriptors['default'] : getAllPropertyDescriptors);

	var element$1 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.element = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  var documentCreateElement = document.createElement.bind(document);

	  module.exports = {
	    create: function create(Ctor) {
	      var elem = Ctor['extends'] ? documentCreateElement(Ctor['extends'], Ctor.id) : documentCreateElement(Ctor.id);
	      !Ctor.isNative && Ctor['extends'] && elem.setAttribute('is', Ctor.id);
	      return elem;
	    },
	    filter: function filter(elem, defs) {
	      var attrs = elem.attributes;
	      var isAttr = attrs.is;
	      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
	      var tagName = (elem.tagName || elem.localName).toLowerCase();
	      var definition = defs[isAttrValue || tagName];

	      if (!definition) {
	        return;
	      }

	      var tagToExtend = definition['extends'];
	      if (isAttrValue) {
	        if (tagName === tagToExtend) {
	          return [definition];
	        }
	      } else if (!tagToExtend) {
	        return [definition];
	      }
	    }
	  };
	});
	});

	var require$$0$3 = (element$1 && typeof element$1 === 'object' && 'default' in element$1 ? element$1['default'] : element$1);

	var customElements = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.customElements = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function () {
	    return typeof document.registerElement === 'function';
	  };
	});
	});

	var require$$7 = (customElements && typeof customElements === 'object' && 'default' in customElements ? customElements['default'] : customElements);

	var vars = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.vars = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  var VERSION = '__skate_0_14_0';

	  if (!window[VERSION]) {
	    window[VERSION] = {
	      registerIfNotExists: function registerIfNotExists(name, value) {
	        return this[name] || (this[name] = value);
	      }
	    };
	  }

	  module.exports = window[VERSION];
	});
	});

	var require$$2$1 = (vars && typeof vars === 'object' && 'default' in vars ? vars['default'] : vars);

	var registry = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './vars'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$2$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.globals);
	    global.registry = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _vars) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _globals = _interopRequireDefault(_vars);

	  var definitions = {};
	  var map = [];
	  var types = [];

	  module.exports = _globals['default'].registerIfNotExists('registry', {
	    get: function get(name) {
	      return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
	    },
	    set: function set(name, Ctor) {
	      if (this.get(name)) {
	        throw new Error('A Skate component with the name of "' + name + '" already exists.');
	      }

	      var type = Ctor.type;
	      var typeIndex = types.indexOf(type);

	      if (typeIndex === -1) {
	        typeIndex = types.length;
	        types.push(type);
	        map[typeIndex] = {};
	      }

	      return definitions[name] = map[typeIndex][name] = Ctor;
	    },
	    find: function find(elem) {
	      var filtered = [];
	      var typesLength = types.length;
	      for (var a = 0; a < typesLength; a++) {
	        filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
	      }
	      return filtered;
	    }
	  });
	});
	});

	var require$$0$4 = (registry && typeof registry === 'object' && 'default' in registry ? registry['default'] : registry);

	var getClosestIgnoredElement = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './ignored'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$5);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.ignored);
	    global.getClosestIgnoredElement = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _ignored) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _ignored2 = _interopRequireDefault(_ignored);

	  var Element = window.Element;

	  module.exports = function (element) {
	    var parent = element;
	    while (parent instanceof Element) {
	      if ((0, _ignored2['default'])(parent)) {
	        return parent;
	      }
	      parent = parent.parentNode;
	    }
	  };
	});
	});

	var require$$3$2 = (getClosestIgnoredElement && typeof getClosestIgnoredElement === 'object' && 'default' in getClosestIgnoredElement ? getClosestIgnoredElement['default'] : getClosestIgnoredElement);

	var innerhtml = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports'], factory);
	  } else if (typeof exports !== 'undefined') {
	    factory(exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports);
	    global.innerhtml = mod.exports;
	  }
	})(__commonjs_global, function (exports) {
	  'use strict';

	  var isIeUntil10 = /MSIE/.test(navigator.userAgent);
	  var isIe11 = /Trident/.test(navigator.userAgent);
	  var isIe = isIeUntil10 || isIe11;
	  var elementPrototype = window.HTMLElement.prototype;

	  // ! This walkTree method differs from the implementation in ../../utils/walk-tree
	  // It invokes the callback only for the children, not the passed node and the second parameter to the callback is the parent node
	  function walkTree(node, cb) {
	    var childNodes = node.childNodes;

	    if (!childNodes) {
	      return;
	    }

	    var childNodesLen = childNodes.length;

	    for (var a = 0; a < childNodesLen; a++) {
	      var childNode = childNodes[a];
	      cb(childNode, node);
	      walkTree(childNode, cb);
	    }
	  }

	  function fixInnerHTML() {
	    var originalInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');

	    var get = function get() {
	      return originalInnerHTML.get.call(this);
	    };
	    get._hasBeenEnhanced = true;

	    // This redefines the innerHTML property so that we can ensure that events
	    // are properly triggered.
	    Object.defineProperty(elementPrototype, 'innerHTML', {
	      get: get,
	      set: function set(html) {
	        walkTree(this, function (node, parentNode) {
	          var mutationEvent = document.createEvent('MutationEvent');
	          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, parentNode, null, null, null, null);
	          node.dispatchEvent(mutationEvent);
	        });
	        originalInnerHTML.set.call(this, html);
	      }
	    });
	  }

	  if (isIe) {
	    // IE 9-11
	    var propertyDescriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');
	    var hasBeenEnhanced = !!propertyDescriptor && propertyDescriptor.get._hasBeenEnhanced;

	    if (!hasBeenEnhanced) {
	      if (isIe11) {
	        // IE11's native MutationObserver needs some help as well :()
	        window.MutationObserver = window.JsMutationObserver || window.MutationObserver;
	      }

	      fixInnerHTML();
	    }
	  }
	});
	});

	var require$$4 = (innerhtml && typeof innerhtml === 'object' && 'default' in innerhtml ? innerhtml['default'] : innerhtml);

	var documentObserver = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../fix/ie/innerhtml', '../util/get-closest-ignored-element', './vars', './registry', '../util/walk-tree'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$4, require$$3$2, require$$2$1, require$$0$4, require$$0$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.innerhtml, global.getClosestIgnoredElement, global.globals, global.registry, global.walkTree);
	    global.documentObserver = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _fixIeInnerhtml, _utilGetClosestIgnoredElement, _vars, _registry, _utilWalkTree) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _getClosestIgnoredElement = _interopRequireDefault(_utilGetClosestIgnoredElement);

	  var _globals = _interopRequireDefault(_vars);

	  var _registry2 = _interopRequireDefault(_registry);

	  var _walkTree = _interopRequireDefault(_utilWalkTree);

	  function triggerAddedNodes(addedNodes) {
	    (0, _walkTree['default'])(addedNodes, function (element) {
	      var components = _registry2['default'].find(element);
	      var componentsLength = components.length;

	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.createdCallback.call(element);
	      }

	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.attachedCallback.call(element);
	      }
	    });
	  }

	  function triggerRemovedNodes(removedNodes) {
	    (0, _walkTree['default'])(removedNodes, function (element) {
	      var components = _registry2['default'].find(element);
	      var componentsLength = components.length;

	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.detachedCallback.call(element);
	      }
	    });
	  }

	  function documentObserverHandler(mutations) {
	    var mutationsLength = mutations.length;

	    for (var a = 0; a < mutationsLength; a++) {
	      var addedNodes = mutations[a].addedNodes;
	      var removedNodes = mutations[a].removedNodes;

	      // Since siblings are batched together, we check the first node's parent
	      // node to see if it is ignored. If it is then we don't process any added
	      // nodes. This prevents having to check every node.
	      if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement['default'])(addedNodes[0].parentNode)) {
	        triggerAddedNodes(addedNodes);
	      }

	      // We can't check batched nodes here because they won't have a parent node.
	      if (removedNodes && removedNodes.length) {
	        triggerRemovedNodes(removedNodes);
	      }
	    }
	  }

	  function createMutationObserver() {
	    var MutationObserver = window.MutationObserver;

	    if (!MutationObserver) {
	      throw new Error('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
	    }
	    return new MutationObserver(documentObserverHandler);
	  }

	  function createDocumentObserver() {
	    var observer = createMutationObserver();
	    observer.observe(document, {
	      childList: true,
	      subtree: true
	    });
	    return observer;
	  }

	  module.exports = _globals['default'].registerIfNotExists('observer', {
	    observer: undefined,
	    register: function register() {
	      if (!this.observer) {
	        this.observer = createDocumentObserver();
	      }
	      return this;
	    },
	    unregister: function unregister() {
	      if (this.observer) {
	        this.observer.disconnect();
	        this.observer = undefined;
	      }
	      return this;
	    }
	  });
	});
	});

	var require$$9 = (documentObserver && typeof documentObserver === 'object' && 'default' in documentObserver ? documentObserver['default'] : documentObserver);

	var data = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.data = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (element) {
	    var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	    return namespace && (data[namespace] || (data[namespace] = {})) || data;
	  };
	});
	});

	var require$$1$2 = (data && typeof data === 'object' && 'default' in data ? data['default'] : data);

	var detached = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/data'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$1$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.data);
	    global.detached = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilData) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _data = _interopRequireDefault(_utilData);

	  module.exports = function (opts) {
	    return function () {
	      var info = (0, _data['default'])(this, 'lifecycle/' + opts.id);
	      if (info.detached) return;
	      info.detached = true;
	      info.attached = false;
	      opts.detached(this);
	    };
	  };
	});
	});

	var require$$10 = (detached && typeof detached === 'object' && 'default' in detached ? detached['default'] : detached);

	var defaults = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './type/element'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$3);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.type);
	    global.defaults = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _typeElement) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _type = _interopRequireDefault(_typeElement);

	  var noop = function noop() {};

	  module.exports = {
	    attached: noop,
	    attribute: noop,
	    created: noop,
	    render: noop,
	    detached: noop,
	    events: {},
	    'extends': '',
	    properties: {},
	    prototype: {},
	    resolvedAttribute: 'resolved',
	    ready: noop,
	    type: _type['default'],
	    unresolvedAttribute: 'unresolved'
	  };
	});
	});

	var require$$11 = (defaults && typeof defaults === 'object' && 'default' in defaults ? defaults['default'] : defaults);

	var resolve = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.resolve = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = resolve;

	  function resolve(elem, opts) {
	    elem.removeAttribute(opts.unresolvedAttribute);
	    elem.setAttribute(opts.resolvedAttribute, '');
	  }
	});
	});

	var require$$0$6 = (resolve && typeof resolve === 'object' && 'default' in resolve ? resolve['default'] : resolve);

	var prototype = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/protos', '../util/define-properties', '../util/get-own-property-descriptors'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$2, require$$1, require$$0$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.protos, global.utilDefineProperties, global.utilGetOwnPropertyDescriptors);
	    global.prototype = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilProtos, _utilDefineProperties, _utilGetOwnPropertyDescriptors) {
	  'use strict';

	  module.exports = prototype;

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _protos = _interopRequireDefault(_utilProtos);

	  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);

	  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);

	  function prototype(opts) {
	    var prototypes = (0, _protos['default'])(opts.prototype);
	    return function (elem) {
	      prototypes.forEach(function (proto) {
	        if (!proto.isPrototypeOf(elem)) {
	          (0, _utilDefineProperties2['default'])(elem, (0, _utilGetOwnPropertyDescriptors2['default'])(proto));
	        }
	      });
	    };
	  }
	});
	});

	var require$$1$3 = (prototype && typeof prototype === 'object' && 'default' in prototype ? prototype['default'] : prototype);

	var propertiesReady = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.propertiesReady = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = propertiesApply;

	  function propertiesApply(elem, properties) {
	    Object.keys(properties).forEach(function (name) {
	      properties[name].ready(elem);
	    });
	  }
	});
	});

	var require$$2$2 = (propertiesReady && typeof propertiesReady === 'object' && 'default' in propertiesReady ? propertiesReady['default'] : propertiesReady);

	var propertiesCreated = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.propertiesCreated = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = propertiesApply;

	  function propertiesApply(elem, properties) {
	    Object.keys(properties).forEach(function (name) {
	      var prop = properties[name];
	      var initialValue = prop.initial(elem);

	      // https://bugs.webkit.org/show_bug.cgi?id=49739
	      //
	      // When Webkit fixes that bug so that native property accessors can be
	      // retrieved, we can move defining the property to the prototype and away
	      // from having to do if for every instance as all other browsers support
	      // this.
	      Object.defineProperty(elem, name, prop);

	      // This will still be needed to do any setup for the property if it needs
	      // any information from the element.
	      //
	      // Once that bug is fixed, the initial value being passed as the second
	      // argument to prop.created() can use the overridden property definition to
	      // get the initial value.
	      prop.created(elem, initialValue);
	    });
	  }
	});
	});

	var require$$3$3 = (propertiesCreated && typeof propertiesCreated === 'object' && 'default' in propertiesCreated ? propertiesCreated['default'] : propertiesCreated);

	var empty = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.empty = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (val) {
	    return typeof val === 'undefined' || val === null;
	  };
	});
	});

	var require$$0$9 = (empty && typeof empty === 'object' && 'default' in empty ? empty['default'] : empty);

	var dashCase = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.dashCase = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = function (str) {
	    return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	      var dash = !one || idx % 2 === 0 ? '' : '-';
	      return '' + one + dash + two.toLowerCase();
	    });
	  };
	});
	});

	var require$$2$4 = (dashCase && typeof dashCase === 'object' && 'default' in dashCase ? dashCase['default'] : dashCase);

	var index = __commonjs(function (module) {
	/* eslint-disable no-unused-vars */
	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};
	});

	var require$$3 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	var propertiesInit = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', 'object-assign', '../util/dash-case', '../util/data', '../util/empty'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$3, require$$2$4, require$$1$2, require$$0$9);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.assign, global.dashCase, global.data, global.empty);
	    global.propertiesInit = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _objectAssign, _utilDashCase, _utilData, _utilEmpty) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _assign = _interopRequireDefault(_objectAssign);

	  var _dashCase = _interopRequireDefault(_utilDashCase);

	  var _data = _interopRequireDefault(_utilData);

	  var _empty = _interopRequireDefault(_utilEmpty);

	  var _window$Element$prototype = window.Element.prototype;
	  var removeAttribute = _window$Element$prototype.removeAttribute;
	  var setAttribute = _window$Element$prototype.setAttribute;

	  function getData(elem, name) {
	    return (0, _data['default'])(elem, 'api/property/' + name);
	  }

	  function getDataForAttribute(elem, name) {
	    return getData(elem, getData(elem, name).linkedProperty);
	  }

	  function getLinkedAttribute(name, attr) {
	    return attr === true ? (0, _dashCase['default'])(name) : attr;
	  }

	  function createNativePropertyDefinition(name, opts) {
	    var prop = {
	      configurable: true,
	      enumerable: true
	    };

	    prop.created = function (elem, initialValue) {
	      var info = getData(elem, name);
	      info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
	      info.opts = opts;
	      info.updatingProperty = false;

	      // Ensure we can get the info from inside the attribute methods.
	      getData(elem, info.linkedAttribute).linkedProperty = name;

	      if (typeof opts['default'] === 'function') {
	        info.defaultValue = opts['default'](elem, { name: name });
	      } else if (!(0, _empty['default'])(opts['default'])) {
	        info.defaultValue = opts['default'];
	      }

	      // TODO Refactor to be cleaner.
	      //
	      // We only override removeAttribute and setAttribute once. This means that
	      // if you define 10 properties, they still only get overridden once. For
	      // this reason, we must re-get info / opts from within the property methods
	      // since the functions aren't recreated for each scope.
	      if (info.linkedAttribute) {
	        if (!info.attributeMap) {
	          info.attributeMap = {};

	          elem.removeAttribute = function (attrName) {
	            var info = getDataForAttribute(this, attrName);

	            if (!info.linkedAttribute) {
	              return removeAttribute.call(this, attrName);
	            }

	            var prop = info.attributeMap[attrName];
	            var serializedValue = info.opts.serialize(info.defaultValue);
	            info.updatingAttribute = true;

	            if ((0, _empty['default'])(serializedValue)) {
	              removeAttribute.call(this, attrName);
	            } else {
	              setAttribute.call(this, attrName, serializedValue);
	            }

	            if (prop) {
	              elem[prop] = undefined;
	            }

	            info.updatingAttribute = false;
	          };

	          elem.setAttribute = function (attrName, attrValue) {
	            var info = getDataForAttribute(this, attrName);

	            if (!info.linkedAttribute) {
	              return setAttribute.call(this, attrName, attrValue);
	            }

	            var prop = info.attributeMap[attrName];
	            info.updatingAttribute = true;
	            setAttribute.call(this, attrName, attrValue);

	            if (prop) {
	              elem[prop] = info.opts.deserialize(attrValue);
	            }

	            info.updatingAttribute = false;
	          };
	        }

	        info.attributeMap[info.linkedAttribute] = name;
	      }

	      // Set up initial value if it wasn't specified.
	      if ((0, _empty['default'])(initialValue)) {
	        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
	          initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
	        } else {
	          initialValue = info.defaultValue;
	        }
	      }

	      // We must coerce the initial value just in case it wasn't already.
	      var internalValue = info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

	      // User-defined created callback.
	      if (typeof opts.created === 'function') {
	        opts.created(elem, { name: name, internalValue: internalValue });
	      }
	    };

	    prop.get = function () {
	      var info = getData(this, name);
	      var internalValue = info.internalValue;

	      if (opts.get) {
	        return opts.get(this, { name: name, internalValue: internalValue });
	      }

	      return internalValue;
	    };

	    prop.initial = function (elem) {
	      return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : elem[name];
	    };

	    prop.ready = function (elem) {
	      var initial = getData(elem, name).internalValue;
	      elem[name] = (0, _empty['default'])(initial) ? this.initial(elem) : initial;
	    };

	    prop.set = function (newValue) {
	      var info = getData(this, name);
	      var oldValue = info.oldValue;

	      if (info.updatingProperty) {
	        return;
	      }

	      info.updatingProperty = true;

	      if ((0, _empty['default'])(newValue)) {
	        newValue = info.defaultValue;
	      }

	      if (typeof opts.coerce === 'function') {
	        newValue = opts.coerce(newValue);
	      }

	      info.internalValue = newValue;

	      if (info.linkedAttribute && !info.updatingAttribute) {
	        var serializedValue = opts.serialize(newValue);
	        if ((0, _empty['default'])(serializedValue)) {
	          removeAttribute.call(this, info.linkedAttribute);
	        } else {
	          setAttribute.call(this, info.linkedAttribute, serializedValue);
	        }
	      }

	      if (typeof opts.set === 'function') {
	        opts.set(this, { name: name, newValue: newValue, oldValue: oldValue });
	      }

	      info.oldValue = newValue;
	      info.updatingProperty = false;
	    };

	    return prop;
	  }

	  module.exports = function (opts) {
	    opts = opts || {};

	    if (typeof opts === 'function') {
	      opts = { coerce: opts };
	    }

	    return function (name) {
	      return createNativePropertyDefinition(name, (0, _assign['default'])({
	        deserialize: function deserialize(value) {
	          return value;
	        },
	        serialize: function serialize(value) {
	          return value;
	        }
	      }, opts));
	    };
	  };
	});
	});

	var require$$4$1 = (propertiesInit && typeof propertiesInit === 'object' && 'default' in propertiesInit ? propertiesInit['default'] : propertiesInit);

	var patchAttributeMethods = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.patchAttributeMethods = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  module.exports = patchAttributeMethods;

	  function patchAttributeMethods(elem) {
	    var removeAttribute = elem.removeAttribute;
	    var setAttribute = elem.setAttribute;

	    elem.removeAttribute = function (name) {
	      var oldValue = this.getAttribute(name);
	      removeAttribute.call(elem, name);
	      elem.attributeChangedCallback(name, oldValue, null);
	    };

	    elem.setAttribute = function (name, newValue) {
	      var oldValue = this.getAttribute(name);
	      setAttribute.call(elem, name, newValue);
	      elem.attributeChangedCallback(name, oldValue, String(newValue));
	    };
	  }
	});
	});

	var require$$5$1 = (patchAttributeMethods && typeof patchAttributeMethods === 'object' && 'default' in patchAttributeMethods ? patchAttributeMethods['default'] : patchAttributeMethods);

	var matchesSelector = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.matchesSelector = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  var elProto = window.HTMLElement.prototype;
	  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

	  // Only IE9 has this msMatchesSelector bug, but best to detect it.
	  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');

	  module.exports = function (element, selector) {
	    if (hasNativeMatchesSelectorDetattachedBug) {
	      var clone = element.cloneNode();
	      document.createElement('div').appendChild(clone);
	      return nativeMatchesSelector.call(clone, selector);
	    }
	    return nativeMatchesSelector.call(element, selector);
	  };
	});
	});

	var require$$0$10 = (matchesSelector && typeof matchesSelector === 'object' && 'default' in matchesSelector ? matchesSelector['default'] : matchesSelector);

	var events = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/matches-selector'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$10);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.matches);
	    global.events = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilMatchesSelector) {
	  'use strict';

	  module.exports = events;

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _matches = _interopRequireDefault(_utilMatchesSelector);

	  function readonly(obj, prop, val) {
	    Object.defineProperty(obj, prop, {
	      configurable: true,
	      get: function get() {
	        return val;
	      }
	    });
	  }

	  function parseEvent(e) {
	    var parts = e.split(' ');
	    var name = parts.shift();
	    var selector = parts.join(' ').trim();
	    return {
	      name: name,
	      selector: selector
	    };
	  }

	  function makeDelegateHandler(elem, handler, parsed) {
	    return function (e) {
	      var current = e.target;
	      var selector = parsed.selector;
	      while (current && current !== elem.parentNode) {
	        if ((0, _matches['default'])(current, selector)) {
	          readonly(e, 'currentTarget', current);
	          readonly(e, 'delegateTarget', elem);
	          return handler(e);
	        }
	        current = current.parentNode;
	      }
	    };
	  }

	  function makeNormalHandler(elem, handler) {
	    return function (e) {
	      readonly(e, 'delegateTarget', elem);
	      handler(e);
	    };
	  }

	  function bindEvent(elem, event, handler) {
	    var parsed = parseEvent(event);
	    var name = parsed.name;
	    var selector = parsed.selector;

	    var capture = selector && (name === 'blur' || name === 'focus');
	    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
	    elem.addEventListener(name, handler, capture);
	  }

	  function events(opts) {
	    var events = opts.events;
	    return function (elem) {
	      Object.keys(events).forEach(function (name) {
	        bindEvent(elem, name, events[name].bind(elem));
	      });
	    };
	  }
	});
	});

	var require$$6 = (events && typeof events === 'object' && 'default' in events ? events['default'] : events);

	var elementContains = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["exports", "module"], factory);
	  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.elementContains = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  "use strict";

	  var elementPrototype = window.HTMLElement.prototype;
	  var elementPrototypeContains = elementPrototype.contains;

	  module.exports = function (source, target) {
	    // The document element does not have the contains method in IE.
	    if (source === document && !source.contains) {
	      return document.head.contains(target) || document.body.contains(target);
	    }

	    return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
	  };
	});
	});

	var require$$0$8 = (elementContains && typeof elementContains === 'object' && 'default' in elementContains ? elementContains['default'] : elementContains);

	var emit = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/element-contains'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$8);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.utilElementContains);
	    global.emit = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilElementContains) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);

	  var CustomEvent = function (CustomEvent) {
	    if (CustomEvent) {
	      try {
	        new CustomEvent();
	      } catch (e) {
	        return undefined;
	      }
	    }
	    return CustomEvent;
	  }(window.CustomEvent);

	  function dispatch(elem, cEvent) {
	    if (!elem.disabled) {
	      return elem.dispatchEvent(cEvent);
	    }
	    cEvent.isPropagationStopped = true;
	  }

	  var hasBubbleOnDetachedElements = function () {
	    var parent = document.createElement('div');
	    var child = document.createElement('div');
	    var hasBubbleOnDetachedElements = false;
	    parent.appendChild(child);
	    parent.addEventListener('test', function () {
	      return hasBubbleOnDetachedElements = true;
	    });
	    child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
	    return hasBubbleOnDetachedElements;
	  }();

	  function createCustomEvent(name) {
	    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    if (CustomEvent) {
	      return new CustomEvent(name, opts);
	    }

	    var e = document.createEvent('CustomEvent');
	    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
	    return e;
	  }

	  function createReadableStopPropagation(oldStopPropagation) {
	    return function () {
	      this.isPropagationStopped = true;
	      oldStopPropagation.call(this);
	    };
	  }

	  function simulateBubbling(elem, cEvent) {
	    var didPreventDefault = undefined;
	    var currentElem = elem;
	    cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
	    Object.defineProperty(cEvent, 'target', { get: function get() {
	        return elem;
	      } });
	    while (currentElem && !cEvent.isPropagationStopped) {
	      cEvent.currentTarget = currentElem;
	      if (dispatch(currentElem, cEvent) === false) {
	        didPreventDefault = false;
	      }
	      currentElem = currentElem.parentNode;
	    }
	    return didPreventDefault;
	  }

	  function emitOne(elem, name, opts) {
	    var cEvent, shouldSimulateBubbling;

	    /* jshint expr: true */
	    opts.bubbles === undefined && (opts.bubbles = true);
	    opts.cancelable === undefined && (opts.cancelable = true);
	    cEvent = createCustomEvent(name, opts);
	    shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _utilElementContains2['default'])(document, elem);

	    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
	  }

	  module.exports = function (elem, name) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    var names = typeof name === 'string' ? name.split(' ') : name;
	    return names.reduce(function (prev, curr) {
	      if (emitOne(elem, curr, opts) === false) {
	        prev.push(curr);
	      }
	      return prev;
	    }, []);
	  };
	});
	});

	var require$$7$1 = (emit && typeof emit === 'object' && 'default' in emit ? emit['default'] : emit);

	var created = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/data', '../api/emit', './events', './patch-attribute-methods', './properties-init', './properties-created', './properties-ready', './prototype', './resolve'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$1$2, require$$7$1, require$$6, require$$5$1, require$$4$1, require$$3$3, require$$2$2, require$$1$3, require$$0$6);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.data, global.emit, global.events, global.patchAttributeMethods, global.propertiesInit, global.propertiesCreated, global.propertiesReady, global.prototype, global.resolve);
	    global.created = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilData, _apiEmit, _events, _patchAttributeMethods, _propertiesInit, _propertiesCreated, _propertiesReady, _prototype, _resolve) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _data = _interopRequireDefault(_utilData);

	  var _emit = _interopRequireDefault(_apiEmit);

	  var _events2 = _interopRequireDefault(_events);

	  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

	  var _propertiesInit2 = _interopRequireDefault(_propertiesInit);

	  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);

	  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);

	  var _prototype2 = _interopRequireDefault(_prototype);

	  var _resolve2 = _interopRequireDefault(_resolve);

	  var readyEventName = 'skate.ready';
	  var readyEventOptions = { bubbles: false, cancelable: false };

	  // TODO Remove this when we no longer support the legacy definitions and only
	  // support a superset of a native property definition.
	  function ensurePropertyFunctions(opts) {
	    var properties = opts.properties;
	    var names = Object.keys(properties || {});
	    return names.reduce(function (descriptors, descriptorName) {
	      descriptors[descriptorName] = opts.properties[descriptorName];
	      if (typeof descriptors[descriptorName] !== 'function') {
	        descriptors[descriptorName] = (0, _propertiesInit2['default'])(descriptors[descriptorName]);
	      }
	      return descriptors;
	    }, {});
	  }

	  function ensurePropertyDefinitions(elem, propertyFunctions) {
	    return Object.keys(propertyFunctions || {}).reduce(function (descriptors, descriptorName) {
	      descriptors[descriptorName] = propertyFunctions[descriptorName](descriptorName);
	      return descriptors;
	    }, {});
	  }

	  module.exports = function (opts) {
	    var applyEvents = (0, _events2['default'])(opts);
	    var applyPrototype = (0, _prototype2['default'])(opts);
	    var propertyFunctions = ensurePropertyFunctions(opts);

	    return function () {
	      var info = (0, _data['default'])(this, 'lifecycle/' + opts.id);
	      var native = opts.isNative;
	      var resolved = this.hasAttribute('resolved');

	      if (info.created) return;
	      info.created = true;
	      var propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

	      native || opts.attribute && (0, _patchAttributeMethods2['default'])(this);
	      native || opts.prototype && applyPrototype(this);
	      opts.properties && (0, _propertiesCreated2['default'])(this, propertyDefinitions);
	      opts.events && applyEvents(this);
	      opts.created && opts.created(this);
	      resolved || opts.render && opts.render(this);
	      opts.properties && (0, _propertiesReady2['default'])(this, propertyDefinitions);
	      opts.ready && opts.ready(this);
	      (0, _emit['default'])(this, readyEventName, readyEventOptions);
	      resolved || (0, _resolve2['default'])(this, opts);
	    };
	  };
	});
	});

	var require$$12 = (created && typeof created === 'object' && 'default' in created ? created['default'] : created);

	var attribute = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.attribute = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  var noop = function noop() {};

	  module.exports = function (opts) {
	    var callback = opts.attribute;

	    if (typeof callback !== 'function') {
	      return noop;
	    }

	    return function (name, oldValue, newValue) {
	      callback(this, {
	        name: name,
	        newValue: newValue === null ? undefined : newValue,
	        oldValue: oldValue === null ? undefined : oldValue
	      });
	    };
	  };
	});
	});

	var require$$13 = (attribute && typeof attribute === 'object' && 'default' in attribute ? attribute['default'] : attribute);

	var attached = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/data'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$1$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.data);
	    global.attached = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilData) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _data = _interopRequireDefault(_utilData);

	  module.exports = function (opts) {
	    return function () {
	      var info = (0, _data['default'])(this, 'lifecycle/' + opts.id);
	      if (info.attached) return;
	      info.attached = true;
	      info.detached = false;
	      opts.attached(this);
	    };
	  };
	});
	});

	var require$$14 = (attached && typeof attached === 'object' && 'default' in attached ? attached['default'] : attached);

	var version$1 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.version = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = '0.15.2';
	});
	});

	var require$$16 = (version$1 && typeof version$1 === 'object' && 'default' in version$1 ? version$1['default'] : version$1);

	var render = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../global/registry'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.registry);
	    global.render = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _globalRegistry) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _registry = _interopRequireDefault(_globalRegistry);

	  module.exports = function (elem) {
	    _registry['default'].find(elem).forEach(function (component) {
	      return component.render && component.render(elem);
	    });
	  };
	});
	});

	var require$$17 = (render && typeof render === 'object' && 'default' in render ? render['default'] : render);

	var ready = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/data', '../global/registry'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$1$2, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.data, global.registry);
	    global.ready = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilData, _globalRegistry) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _data = _interopRequireDefault(_utilData);

	  var _registry = _interopRequireDefault(_globalRegistry);

	  function ready(element) {
	    var components = _registry['default'].find(element);
	    var componentsLength = components.length;
	    for (var a = 0; a < componentsLength; a++) {
	      if (!(0, _data['default'])(element, 'lifecycle/' + components[a].id).created) {
	        return false;
	      }
	    }
	    return true;
	  }

	  module.exports = function (elements, callback) {
	    var collection = elements.length === undefined ? [elements] : elements;
	    var collectionLength = collection.length;
	    var readyCount = 0;

	    function callbackIfReady() {
	      if (readyCount === collectionLength) {
	        callback(elements);
	      }
	    }

	    for (var a = 0; a < collectionLength; a++) {
	      var elem = collection[a];

	      if (ready(elem)) {
	        ++readyCount;
	      } else {
	        // skate.ready is only fired if the element has not been initialised yet.
	        elem.addEventListener('skate.ready', function () {
	          ++readyCount;
	          callbackIfReady();
	        });
	      }
	    }

	    // If the elements are all ready by this time that means nothing was ever
	    // bound to skate.ready above.
	    callbackIfReady();
	  };
	});
	});

	var require$$18 = (ready && typeof ready === 'object' && 'default' in ready ? ready['default'] : ready);

	var string = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../../util/empty'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$9);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.empty);
	    global.string = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilEmpty) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _empty = _interopRequireDefault(_utilEmpty);

	  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	    return (0, _empty['default'])(val) ? undefined : String(val);
	  };

	  module.exports = {
	    coerce: alwaysUndefinedIfEmpty,
	    deserialize: alwaysUndefinedIfEmpty,
	    serialize: alwaysUndefinedIfEmpty
	  };
	});
	});

	var require$$0$7 = (string && typeof string === 'object' && 'default' in string ? string['default'] : string);

	var number = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../../util/empty'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$9);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.empty);
	    global.number = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilEmpty) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _empty = _interopRequireDefault(_utilEmpty);

	  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	    return (0, _empty['default'])(val) ? undefined : Number(val);
	  };

	  module.exports = {
	    coerce: alwaysUndefinedIfEmpty,
	    deserialize: alwaysUndefinedIfEmpty,
	    serialize: alwaysUndefinedIfEmpty
	  };
	});
	});

	var require$$1$4 = (number && typeof number === 'object' && 'default' in number ? number['default'] : number);

	var boolean = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod);
	    global.boolean = mod.exports;
	  }
	})(__commonjs_global, function (exports, module) {
	  'use strict';

	  module.exports = {
	    coerce: function coerce(value) {
	      return !!value;
	    },
	    'default': false,
	    deserialize: function deserialize(value) {
	      return !(value === null);
	    },
	    serialize: function serialize(value) {
	      return value ? '' : undefined;
	    }
	  };
	});
	});

	var require$$2$3 = (boolean && typeof boolean === 'object' && 'default' in boolean ? boolean['default'] : boolean);

	var index$2 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', 'object-assign', './boolean', './number', './string'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$3, require$$2$3, require$$1$4, require$$0$7);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.assign, global.boolean, global.number, global.string);
	    global.index = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _objectAssign, _boolean, _number, _string) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _assign = _interopRequireDefault(_objectAssign);

	  var _boolean2 = _interopRequireDefault(_boolean);

	  var _number2 = _interopRequireDefault(_number);

	  var _string2 = _interopRequireDefault(_string);

	  function prop(def) {
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      args.unshift({}, def);
	      return _assign['default'].apply(null, args);
	    };
	  }

	  module.exports = {
	    boolean: prop(_boolean2['default']),
	    number: prop(_number2['default']),
	    string: prop(_string2['default'])
	  };
	});
	});

	var require$$19 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var init = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', '../util/element-contains', '../global/registry', '../util/walk-tree'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$0$8, require$$0$4, require$$0$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.elementContains, global.registry, global.walkTree);
	    global.init = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _utilElementContains, _globalRegistry, _utilWalkTree) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _elementContains = _interopRequireDefault(_utilElementContains);

	  var _registry = _interopRequireDefault(_globalRegistry);

	  var _walkTree = _interopRequireDefault(_utilWalkTree);

	  module.exports = function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args.forEach(function (arg) {
	      var isInDom = (0, _elementContains['default'])(document, arg);
	      (0, _walkTree['default'])(arg, function (descendant) {
	        var components = _registry['default'].find(descendant);
	        var componentsLength = components.length;

	        for (var a = 0; a < componentsLength; a++) {
	          components[a].prototype.createdCallback.call(descendant);
	        }

	        for (var a = 0; a < componentsLength; a++) {
	          if (isInDom) {
	            components[a].prototype.attachedCallback.call(descendant);
	          }
	        }
	      });
	    });
	  };
	});
	});

	var require$$1$1 = (init && typeof init === 'object' && 'default' in init ? init['default'] : init);

	var fragment = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './init'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$1$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.init);
	    global.fragment = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _init) {
	  'use strict';

	  module.exports = fragment;

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _init2 = _interopRequireDefault(_init);

	  var Node = window.Node;
	  var NodeList = window.NodeList;

	  var slice = Array.prototype.slice;
	  var specialMap = {
	    caption: 'table',
	    dd: 'dl',
	    dt: 'dl',
	    li: 'ul',
	    tbody: 'table',
	    td: 'tr',
	    thead: 'table',
	    tr: 'tbody'
	  };

	  function resolveParent(tag, html) {
	    var container = document.createElement('div');
	    var levels = 0;
	    var parentTag = specialMap[tag];

	    while (parentTag) {
	      html = '<' + parentTag + '>' + html + '</' + parentTag + '>';
	      ++levels;
	      parentTag = specialMap[parentTag];
	    }

	    container.innerHTML = html;

	    var parent = container;
	    for (var a = 0; a < levels; a++) {
	      parent = parent.firstElementChild;
	    }
	    return parent;
	  }

	  function resolveTag(html) {
	    var tag = html.match(/^<([^\s>]+)/);
	    return tag && tag[1];
	  }

	  function resolveHtml(html) {
	    return resolveParent(resolveTag(html), html);
	  }

	  function fragment() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return args.reduce(function (frag, node) {
	      if (typeof node === 'string') {
	        node = fragment.apply(null, slice.call(resolveHtml(node).childNodes));
	      } else if (node instanceof NodeList || Array.isArray(node)) {
	        node = fragment.apply(null, slice.call(node));
	      } else if (node instanceof Node) {
	        (0, _init2['default'])(node);
	      }

	      if (node) {
	        frag.appendChild(node);
	      }

	      return frag;
	    }, document.createDocumentFragment());
	  }
	});
	});

	var require$$21 = (fragment && typeof fragment === 'object' && 'default' in fragment ? fragment['default'] : fragment);

	var create = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', 'object-assign', './init', '../global/registry'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$3, require$$1$1, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.assign, global.init, global.registry);
	    global.create = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _objectAssign, _init, _globalRegistry) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _assign = _interopRequireDefault(_objectAssign);

	  var _init2 = _interopRequireDefault(_init);

	  var _registry = _interopRequireDefault(_globalRegistry);

	  module.exports = function (name, props) {
	    var Ctor = _registry['default'].get(name);
	    var elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
	    Ctor && Ctor.isNative || (0, _init2['default'])(elem);
	    return (0, _assign['default'])(elem, props);
	  };
	});
	});

	var require$$23 = (create && typeof create === 'object' && 'default' in create ? create['default'] : create);

	var index$1 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './defaults', './lifecycle/detached', './global/document-observer', './global/registry', './support/custom-elements', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree', './support/valid-custom-element'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$23, require$$7$1, require$$21, require$$1$1, require$$19, require$$18, require$$17, require$$16, require$$3, require$$14, require$$13, require$$12, require$$11, require$$10, require$$9, require$$0$4, require$$7, require$$0$3, require$$5, require$$0$2, require$$3$1, require$$1, require$$0$1, require$$0);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, mod, global.apiCreate, global.apiEmit, global.apiFragment, global.apiInit, global.apiProperties, global.apiReady, global.apiRender, global.apiVersion, global.assign, global.attached, global.attribute, global.created, global.defaults, global.detached, global.documentObserver, global.registry, global.supportsCustomElements, global.typeElement, global.utilGetAllPropertyDescriptors, global.utilGetOwnPropertyDescriptors, global.utilDebounce, global.utilDefineProperties, global.utilWalkTree, global.validCustomElement);
	    global.index = mod.exports;
	  }
	})(__commonjs_global, function (exports, module, _apiCreate, _apiEmit, _apiFragment, _apiInit, _apiPropertiesIndex, _apiReady, _apiRender, _apiVersion, _objectAssign, _lifecycleAttached, _lifecycleAttribute, _lifecycleCreated, _defaults, _lifecycleDetached, _globalDocumentObserver, _globalRegistry, _supportCustomElements, _typeElement, _utilGetAllPropertyDescriptors, _utilGetOwnPropertyDescriptors, _utilDebounce, _utilDefineProperties, _utilWalkTree, _supportValidCustomElement) {
	  'use strict';

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : { 'default': obj };
	  }

	  var _apiCreate2 = _interopRequireDefault(_apiCreate);

	  var _apiEmit2 = _interopRequireDefault(_apiEmit);

	  var _apiFragment2 = _interopRequireDefault(_apiFragment);

	  var _apiInit2 = _interopRequireDefault(_apiInit);

	  var _apiProperties = _interopRequireDefault(_apiPropertiesIndex);

	  var _apiReady2 = _interopRequireDefault(_apiReady);

	  var _apiRender2 = _interopRequireDefault(_apiRender);

	  var _apiVersion2 = _interopRequireDefault(_apiVersion);

	  var _assign = _interopRequireDefault(_objectAssign);

	  var _attached = _interopRequireDefault(_lifecycleAttached);

	  var _attribute = _interopRequireDefault(_lifecycleAttribute);

	  var _created = _interopRequireDefault(_lifecycleCreated);

	  var _defaults2 = _interopRequireDefault(_defaults);

	  var _detached = _interopRequireDefault(_lifecycleDetached);

	  var _documentObserver = _interopRequireDefault(_globalDocumentObserver);

	  var _registry = _interopRequireDefault(_globalRegistry);

	  var _supportsCustomElements = _interopRequireDefault(_supportCustomElements);

	  var _typeElement2 = _interopRequireDefault(_typeElement);

	  var _utilGetAllPropertyDescriptors2 = _interopRequireDefault(_utilGetAllPropertyDescriptors);

	  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);

	  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);

	  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);

	  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);

	  var _validCustomElement = _interopRequireDefault(_supportValidCustomElement);

	  var HTMLElement = window.HTMLElement;

	  // A function that initialises the document once in a given event loop.
	  var initDocument = (0, _utilDebounce2['default'])(function () {
	    // For performance in older browsers, we use:
	    //
	    // - childNodes instead of children
	    // - for instead of forEach
	    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
	      var components = _registry['default'].find(element);
	      var componentsLength = components.length;

	      // Created callbacks are called first.
	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.createdCallback.call(element);
	      }

	      // Attached callbacks are called separately because this emulates how
	      // native works internally.
	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.attachedCallback.call(element);
	      }
	    });
	  });

	  // Creates a configurable, non-writable, non-enumerable property.
	  function fixedProp(obj, name, value) {
	    Object.defineProperty(obj, name, {
	      configurable: true,
	      enumerable: false, value: value,
	      writable: false
	    });
	  }

	  // Makes a function / constructor that can be called as either.
	  function makeCtor(name, opts) {
	    var func = _apiCreate2['default'].bind(null, name);

	    // Assigning defaults gives a predictable definition and prevents us from
	    // having to do defaults checks everywhere.
	    (0, _assign['default'])(func, _defaults2['default']);

	    // Inherit all options. This takes into account object literals as well as
	    // ES2015 classes that may have inherited static props which would not be
	    // considered "own".
	    (0, _utilDefineProperties2['default'])(func, (0, _utilGetAllPropertyDescriptors2['default'])(opts));

	    // Fixed info.
	    fixedProp(func.prototype, 'constructor', func);
	    fixedProp(func, 'id', name);
	    fixedProp(func, 'isNative', func.type === _typeElement2['default'] && (0, _supportsCustomElements['default'])() && (0, _validCustomElement['default'])(name));

	    // *sigh* WebKit
	    //
	    // In native, the function name is the same as the custom element name, but
	    // WebKit prevents this from being defined. We do this where possible and
	    // still define `id` for cross-browser compatibility.
	    var nameProp = Object.getOwnPropertyDescriptor(func, 'name');
	    if (nameProp && nameProp.configurable) {
	      fixedProp(func, 'name', name);
	    }

	    return func;
	  }

	  // The main skate() function.
	  function skate(name, opts) {
	    var Ctor = makeCtor(name, opts);
	    var proto = (Ctor['extends'] ? document.createElement(Ctor['extends']).constructor : HTMLElement).prototype;

	    // If the options don't inherit a native element prototype, we ensure it does
	    // because native unnecessarily requires you explicitly do this.
	    if (!proto.isPrototypeOf(Ctor.prototype)) {
	      Ctor.prototype = Object.create(proto, (0, _utilGetOwnPropertyDescriptors2['default'])(Ctor.prototype));
	    }

	    // We not assign native callbacks to handle the callbacks specified in the
	    // Skate definition. This allows us to abstract away any changes that may
	    // occur in the spec.
	    Ctor.prototype.createdCallback = (0, _created['default'])(Ctor);
	    Ctor.prototype.attachedCallback = (0, _attached['default'])(Ctor);
	    Ctor.prototype.detachedCallback = (0, _detached['default'])(Ctor);
	    Ctor.prototype.attributeChangedCallback = (0, _attribute['default'])(Ctor);

	    // In native, we have to massage the definition so that the browser doesn't
	    // spit out errors for a malformed definition. In polyfill land we must
	    // emulate what the browser would normally do in native.
	    if (Ctor.isNative) {
	      var nativeDefinition = { prototype: Ctor.prototype };
	      Ctor['extends'] && (nativeDefinition['extends'] = Ctor['extends']);
	      document.registerElement(name, nativeDefinition);
	    } else {
	      initDocument();
	      _documentObserver['default'].register();
	    }

	    // We keep our own registry since we can't access the native one.
	    return _registry['default'].set(name, Ctor);
	  }

	  // Public API.
	  skate.create = _apiCreate2['default'];
	  skate.emit = _apiEmit2['default'];
	  skate.fragment = _apiFragment2['default'];
	  skate.init = _apiInit2['default'];
	  skate.properties = _apiProperties['default'];
	  skate.ready = _apiReady2['default'];
	  skate.render = _apiRender2['default'];
	  skate.version = _apiVersion2['default'];

	  module.exports = skate;
	});
	});

	var skate = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

	var VERSION = '__skate_0_14_0';

	if (!window[VERSION]) {
	  window[VERSION] = {
	    registerIfNotExists: function registerIfNotExists(name, value) {
	      return this[name] || (this[name] = value);
	    }
	  };
	}

	var globals = window[VERSION];

	var definitions = {};
	var map$1 = [];
	var types = [];

	var registry$1 = globals.registerIfNotExists('registry', {
	  get: function get(name) {
	    return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
	  },
	  set: function set(name, Ctor) {
	    if (this.get(name)) {
	      throw new Error('A Skate component with the name of "' + name + '" already exists.');
	    }

	    var type = Ctor.type;
	    var typeIndex = types.indexOf(type);

	    if (typeIndex === -1) {
	      typeIndex = types.length;
	      types.push(type);
	      map$1[typeIndex] = {};
	    }

	    return definitions[name] = map$1[typeIndex][name] = Ctor;
	  },
	  find: function find(elem) {
	    var filtered = [];
	    var typesLength = types.length;
	    for (var a = 0; a < typesLength; a++) {
	      filtered = filtered.concat(types[a].filter(elem, map$1[a]) || []);
	    }
	    return filtered;
	  }
	});

	function render$2 (elem) {
	  registry$1.find(elem).forEach(function (component) {
	    return component.render && component.render(elem);
	  });
	}

	function linkPropsToAttrsIfNotSpecified(opts) {
	  var props = opts.properties;
	  Object.keys(props || {}).forEach(function (name) {
	    var prop = props[name];
	    if (typeof prop.attribute === 'undefined') {
	      prop.attribute = true;
	    }
	  });
	}

	function createSlotProperties(opts) {
	  if (!opts.slots) {
	    opts.slots = [];
	  }

	  if (!opts.properties) {
	    opts.properties = {};
	  }

	  var props = opts.properties;

	  opts.slots.forEach(function (name, index) {
	    props[name] = nsSlot({
	      default: index === 0,
	      set: render$2
	    });
	  });
	}

	function wrapRender(opts) {
	  opts.render = nsRender(ddRender(opts.render));
	}

	function register (name, opts) {
	  linkPropsToAttrsIfNotSpecified(opts);
	  createSlotProperties(opts);
	  wrapRender(opts);
	  return skate(name, opts);
	}

	var previousGlobal = window.kickflip;
	register.noConflict = function noConflict() {
	  window.kickflip = previousGlobal;
	  return this;
	};
	window.kickflip = register;

	return register;

}));
//# sourceMappingURL=index.js.map