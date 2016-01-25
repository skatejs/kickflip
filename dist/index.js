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

	var index$9 = __commonjs(function (module, exports, global) {
	'use strict';

	/*global window, global*/

	var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

	module.exports = Individual;

	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }

	    root[key] = value;

	    return value;
	}
	});

	var require$$0$27 = (index$9 && typeof index$9 === 'object' && 'default' in index$9 ? index$9['default'] : index$9);

	var oneVersion = __commonjs(function (module) {
	'use strict';

	var Individual = require$$0$27;

	module.exports = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' + moduleName + '.\n' + 'You already have version ' + versionValue + ' installed.\n' + 'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}
	});

	var require$$0$26 = (oneVersion && typeof oneVersion === 'object' && 'default' in oneVersion ? oneVersion['default'] : oneVersion);

	var index$7 = __commonjs(function (module) {
	'use strict';

	var OneVersionConstraint = require$$0$26;

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	module.exports = EvStore;

	function EvStore(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}
	});

	var require$$0$21 = (index$7 && typeof index$7 === 'object' && 'default' in index$7 ? index$7['default'] : index$7);

	var evHook = __commonjs(function (module) {
	'use strict';

	var EvStore = require$$0$21;

	module.exports = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};
	});

	var require$$0$19 = (evHook && typeof evHook === 'object' && 'default' in evHook ? evHook['default'] : evHook);

	var softSetHook = __commonjs(function (module) {
	'use strict';

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};
	});

	var require$$1$8 = (softSetHook && typeof softSetHook === 'object' && 'default' in softSetHook ? softSetHook['default'] : softSetHook);

	var index$4 = __commonjs(function (module) {
	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = function split(undef) {

	  var nativeSplit = String.prototype.split,
	      compliantExecNpcg = /()??/.exec("")[1] === undef,

	  // NPCG: nonparticipating capturing group
	  self;

	  self = function self(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
	    separator.sticky ? "y" : ""),

	    // Firefox 3+
	    lastLastIndex = 0,

	    // Make `global` and avoid `lastIndex` issues by working with a copy
	    separator = new RegExp(separator.source, flags + "g"),
	        separator2,
	        match,
	        lastIndex,
	        lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function () {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	}();
	});

	var require$$0$20 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

	var parseTag = __commonjs(function (module) {
	'use strict';

	var split = require$$0$20;

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = parseTag;

	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !props.hasOwnProperty('id');

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}
	});

	var require$$2$6 = (parseTag && typeof parseTag === 'object' && 'default' in parseTag ? parseTag['default'] : parseTag);

	var isThunk = __commonjs(function (module) {
	module.exports = isThunk;

	function isThunk(t) {
	    return t && t.type === "Thunk";
	}
	});

	var require$$1$7 = (isThunk && typeof isThunk === 'object' && 'default' in isThunk ? isThunk['default'] : isThunk);

	var isVhook = __commonjs(function (module) {
	module.exports = isHook;

	function isHook(hook) {
	  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
	}
	});

	var require$$0$15 = (isVhook && typeof isVhook === 'object' && 'default' in isVhook ? isVhook['default'] : isVhook);

	var isWidget = __commonjs(function (module) {
	module.exports = isWidget;

	function isWidget(w) {
	    return w && w.type === "Widget";
	}
	});

	var require$$2$5 = (isWidget && typeof isWidget === 'object' && 'default' in isWidget ? isWidget['default'] : isWidget);

	var version$1 = __commonjs(function (module) {
	module.exports = "2";
	});

	var require$$4$3 = (version$1 && typeof version$1 === 'object' && 'default' in version$1 ? version$1['default'] : version$1);

	var isVtext = __commonjs(function (module) {
	var version = require$$4$3;

	module.exports = isVirtualText;

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version;
	}
	});

	var require$$6$2 = (isVtext && typeof isVtext === 'object' && 'default' in isVtext ? isVtext['default'] : isVtext);

	var isVnode = __commonjs(function (module) {
	var version = require$$4$3;

	module.exports = isVirtualNode;

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version;
	}
	});

	var require$$3$4 = (isVnode && typeof isVnode === 'object' && 'default' in isVnode ? isVnode['default'] : isVnode);

	var vtext = __commonjs(function (module) {
	var version = require$$4$3;

	module.exports = VirtualText;

	function VirtualText(text) {
	    this.text = String(text);
	}

	VirtualText.prototype.version = version;
	VirtualText.prototype.type = "VirtualText";
	});

	var require$$8 = (vtext && typeof vtext === 'object' && 'default' in vtext ? vtext['default'] : vtext);

	var vnode = __commonjs(function (module) {
	var version = require$$4$3;
	var isVNode = require$$3$4;
	var isWidget = require$$2$5;
	var isThunk = require$$1$7;
	var isVHook = require$$0$15;

	module.exports = VirtualNode;

	var noProperties = {};
	var noChildren = [];

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName;
	    this.properties = properties || noProperties;
	    this.children = children || noChildren;
	    this.key = key != null ? String(key) : undefined;
	    this.namespace = typeof namespace === "string" ? namespace : null;

	    var count = children && children.length || 0;
	    var descendants = 0;
	    var hasWidgets = false;
	    var hasThunks = false;
	    var descendantHooks = false;
	    var hooks;

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName];
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {};
	                }

	                hooks[propName] = property;
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i];
	        if (isVNode(child)) {
	            descendants += child.count || 0;

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true;
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true;
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true;
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true;
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants;
	    this.hasWidgets = hasWidgets;
	    this.hasThunks = hasThunks;
	    this.hooks = hooks;
	    this.descendantHooks = descendantHooks;
	}

	VirtualNode.prototype.version = version;
	VirtualNode.prototype.type = "VirtualNode";
	});

	var require$$9$1 = (vnode && typeof vnode === 'object' && 'default' in vnode ? vnode['default'] : vnode);

	var index$5 = __commonjs(function (module) {
	var nativeIsArray = Array.isArray;
	var toString = Object.prototype.toString;

	module.exports = nativeIsArray || isArray;

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]";
	}
	});

	var require$$10$1 = (index$5 && typeof index$5 === 'object' && 'default' in index$5 ? index$5['default'] : index$5);

	var index$3 = __commonjs(function (module) {
	'use strict';

	var isArray = require$$10$1;

	var VNode = require$$9$1;
	var VText = require$$8;
	var isVNode = require$$3$4;
	var isVText = require$$6$2;
	var isWidget = require$$2$5;
	var isHook = require$$0$15;
	var isVThunk = require$$1$7;

	var parseTag = require$$2$6;
	var softSetHook = require$$1$8;
	var evHook = require$$0$19;

	module.exports = h;

	function h(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;

	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }

	    props = props || properties || {};
	    tag = parseTag(tagName, props);

	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }

	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }

	    // fix cursor bug
	    if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
	        props.value = softSetHook(props.value);
	    }

	    transformProperties(props);

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }

	    return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}

	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];

	            if (isHook(value)) {
	                continue;
	            }

	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}

	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
	    '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;

	    return err;
	}

	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}
	});

	var require$$0$18 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

	var h = __commonjs(function (module) {
	var h = require$$0$18;

	module.exports = h;
	});

	var h$1 = (h && typeof h === 'object' && 'default' in h ? h['default'] : h);

	var index$6 = __commonjs(function (module) {
	"use strict";

	module.exports = function isObject(x) {
		return (typeof x === "undefined" ? "undefined" : babelHelpers.typeof(x)) === "object" && x !== null;
	};
	});

	var require$$1$9 = (index$6 && typeof index$6 === 'object' && 'default' in index$6 ? index$6['default'] : index$6);

	var diffProps = __commonjs(function (module) {
	var isObject = require$$1$9;
	var isHook = require$$0$15;

	module.exports = diffProps;

	function diffProps(a, b) {
	    var diff;

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {};
	            diff[aKey] = undefined;
	        }

	        var aValue = a[aKey];
	        var bValue = b[aKey];

	        if (aValue === bValue) {
	            continue;
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else if (isHook(bValue)) {
	                diff = diff || {};
	                diff[aKey] = bValue;
	            } else {
	                var objectDiff = diffProps(aValue, bValue);
	                if (objectDiff) {
	                    diff = diff || {};
	                    diff[aKey] = objectDiff;
	                }
	            }
	        } else {
	            diff = diff || {};
	            diff[aKey] = bValue;
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {};
	            diff[bKey] = b[bKey];
	        }
	    }

	    return diff;
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}
	});

	var require$$0$17 = (diffProps && typeof diffProps === 'object' && 'default' in diffProps ? diffProps['default'] : diffProps);

	var handleThunk = __commonjs(function (module) {
	var isVNode = require$$3$4;
	var isVText = require$$6$2;
	var isWidget = require$$2$5;
	var isThunk = require$$1$7;

	module.exports = handleThunk;

	function handleThunk(a, b) {
	    var renderedA = a;
	    var renderedB = b;

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a);
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null);
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    };
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode;

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous);
	    }

	    if (!(isVNode(renderedThunk) || isVText(renderedThunk) || isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk;
	}
	});

	var require$$1$6 = (handleThunk && typeof handleThunk === 'object' && 'default' in handleThunk ? handleThunk['default'] : handleThunk);

	var vpatch = __commonjs(function (module) {
	var version = require$$4$3;

	VirtualPatch.NONE = 0;
	VirtualPatch.VTEXT = 1;
	VirtualPatch.VNODE = 2;
	VirtualPatch.WIDGET = 3;
	VirtualPatch.PROPS = 4;
	VirtualPatch.ORDER = 5;
	VirtualPatch.INSERT = 6;
	VirtualPatch.REMOVE = 7;
	VirtualPatch.THUNK = 8;

	module.exports = VirtualPatch;

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type);
	    this.vNode = vNode;
	    this.patch = patch;
	}

	VirtualPatch.prototype.version = version;
	VirtualPatch.prototype.type = "VirtualPatch";
	});

	var require$$6$1 = (vpatch && typeof vpatch === 'object' && 'default' in vpatch ? vpatch['default'] : vpatch);

	var diff$2 = __commonjs(function (module) {
	var isArray = require$$10$1;

	var VPatch = require$$6$1;
	var isVNode = require$$3$4;
	var isVText = require$$6$2;
	var isWidget = require$$2$5;
	var isThunk = require$$1$7;
	var handleThunk = require$$1$6;

	var diffProps = require$$0$17;

	module.exports = diff;

	function diff(a, b) {
	    var patch = { a: a };
	    walk(a, b, patch, 0);
	    return patch;
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return;
	    }

	    var apply = patch[index];
	    var applyClear = false;

	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index);
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index);
	            apply = patch[index];
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties);
	                if (propsPatch) {
	                    apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch));
	                }
	                apply = diffChildren(a, b, patch, apply, index);
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	                applyClear = true;
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
	            applyClear = true;
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	            applyClear = true;
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true;
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
	    }

	    if (apply) {
	        patch[index] = apply;
	    }

	    if (applyClear) {
	        clearState(a, patch, index);
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children;
	    var orderedSet = reorder(aChildren, b.children);
	    var bChildren = orderedSet.children;

	    var aLen = aChildren.length;
	    var bLen = bChildren.length;
	    var len = aLen > bLen ? aLen : bLen;

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i];
	        var rightNode = bChildren[i];
	        index += 1;

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode));
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index);
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count;
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves));
	    }

	    return apply;
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index);
	    destroyWidgets(vNode, patch, index);
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.REMOVE, vNode, null));
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children;
	        var len = children.length;
	        for (var i = 0; i < len; i++) {
	            var child = children[i];
	            index += 1;

	            destroyWidgets(child, patch, index);

	            if (isVNode(child) && child.count) {
	                index += child.count;
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b);
	    var thunkPatch = diff(nodes.a, nodes.b);
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true;
	        }
	    }

	    return false;
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)));
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children;
	            var len = children.length;
	            for (var i = 0; i < len; i++) {
	                var child = children[i];
	                index += 1;

	                unhook(child, patch, index);

	                if (isVNode(child) && child.count) {
	                    index += child.count;
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index);
	    }
	}

	function undefinedKeys(obj) {
	    var result = {};

	    for (var key in obj) {
	        result[key] = undefined;
	    }

	    return result;
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren);
	    var bKeys = bChildIndex.keys;
	    var bFree = bChildIndex.free;

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren);
	    var aKeys = aChildIndex.keys;
	    var aFree = aChildIndex.free;

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        };
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = [];

	    var freeIndex = 0;
	    var freeCount = bFree.length;
	    var deletedItems = 0;

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0; i < aChildren.length; i++) {
	        var aItem = aChildren[i];
	        var itemIndex;

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++];
	                newChildren.push(bChildren[itemIndex]);
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++;
	                newChildren.push(null);
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j];

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem);
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem);
	        }
	    }

	    var simulate = newChildren.slice();
	    var simulateIndex = 0;
	    var removes = [];
	    var inserts = [];
	    var simulateItem;

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k];
	        simulateItem = simulate[simulateIndex];

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null));
	            simulateItem = simulate[simulateIndex];
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                        simulateItem = simulate[simulateIndex];
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({ key: wantedItem.key, to: k });
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                                simulateIndex++;
	                            }
	                    } else {
	                        inserts.push({ key: wantedItem.key, to: k });
	                    }
	                } else {
	                    inserts.push({ key: wantedItem.key, to: k });
	                }
	                k++;
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                    removes.push(remove(simulate, simulateIndex, simulateItem.key));
	                }
	        } else {
	            simulateIndex++;
	            k++;
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while (simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex];
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        };
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    };
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1);

	    return {
	        from: index,
	        key: key
	    };
	}

	function keyIndex(children) {
	    var keys = {};
	    var free = [];
	    var length = children.length;

	    for (var i = 0; i < length; i++) {
	        var child = children[i];

	        if (child.key) {
	            keys[child.key] = i;
	        } else {
	            free.push(i);
	        }
	    }

	    return {
	        keys: keys, // A hash of key name to index
	        free: free // An array of unkeyed item indices
	    };
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch);
	        } else {
	            apply = [apply, patch];
	        }

	        return apply;
	    } else {
	        return patch;
	    }
	}
	});

	var require$$0$16 = (diff$2 && typeof diff$2 === 'object' && 'default' in diff$2 ? diff$2['default'] : diff$2);

	var diff = __commonjs(function (module) {
	var diff = require$$0$16;

	module.exports = diff;
	});

	var diff$1 = (diff && typeof diff === 'object' && 'default' in diff ? diff['default'] : diff);

	var updateWidget = __commonjs(function (module) {
	var isWidget = require$$2$5;

	module.exports = updateWidget;

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id;
	        } else {
	            return a.init === b.init;
	        }
	    }

	    return false;
	}
	});

	var require$$0$14 = (updateWidget && typeof updateWidget === 'object' && 'default' in updateWidget ? updateWidget['default'] : updateWidget);

	var applyProperties = __commonjs(function (module) {
	var isObject = require$$1$9;
	var isHook = require$$0$15;

	module.exports = applyProperties;

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName];

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous);
	            if (propValue.hook) {
	                propValue.hook(node, propName, previous ? previous[propName] : undefined);
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue;
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName];

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName);
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = "";
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = "";
	            } else {
	                node[propName] = null;
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue);
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined;

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName];

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName);
	            } else {
	                node.setAttribute(attrName, attrValue);
	            }
	        }

	        return;
	    }

	    if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue;
	        return;
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {};
	    }

	    var replacer = propName === "style" ? "" : undefined;

	    for (var k in propValue) {
	        var value = propValue[k];
	        node[propName][k] = value === undefined ? replacer : value;
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value);
	    } else if (value.__proto__) {
	        return value.__proto__;
	    } else if (value.constructor) {
	        return value.constructor.prototype;
	    }
	}
	});

	var require$$4$2 = (applyProperties && typeof applyProperties === 'object' && 'default' in applyProperties ? applyProperties['default'] : applyProperties);

	var patchOp = __commonjs(function (module) {
	var applyProperties = require$$4$2;

	var isWidget = require$$2$5;
	var VPatch = require$$6$1;

	var updateWidget = require$$0$14;

	module.exports = applyPatch;

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type;
	    var vNode = vpatch.vNode;
	    var patch = vpatch.patch;

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode);
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions);
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions);
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions);
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch);
	            return domNode;
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties);
	            return domNode;
	        case VPatch.THUNK:
	            return replaceRoot(domNode, renderOptions.patch(domNode, patch, renderOptions));
	        default:
	            return domNode;
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode;

	    if (parentNode) {
	        parentNode.removeChild(domNode);
	    }

	    destroyWidget(domNode, vNode);

	    return null;
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode) {
	        parentNode.appendChild(newNode);
	    }

	    return parentNode;
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode;

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text);
	        newNode = domNode;
	    } else {
	        var parentNode = domNode.parentNode;
	        newNode = renderOptions.render(vText, renderOptions);

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode);
	        }
	    }

	    return newNode;
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget);
	    var newNode;

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode;
	    } else {
	        newNode = renderOptions.render(widget, renderOptions);
	    }

	    var parentNode = domNode.parentNode;

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode);
	    }

	    return newNode;
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode;
	    var newNode = renderOptions.render(vNode, renderOptions);

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode);
	    }

	    return newNode;
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode);
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes;
	    var keyMap = {};
	    var node;
	    var remove;
	    var insert;

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i];
	        node = childNodes[remove.from];
	        if (remove.key) {
	            keyMap[remove.key] = node;
	        }
	        domNode.removeChild(node);
	    }

	    var length = childNodes.length;
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j];
	        node = keyMap[insert.key];
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
	    }

	    return newRoot;
	}
	});

	var require$$0$12 = (patchOp && typeof patchOp === 'object' && 'default' in patchOp ? patchOp['default'] : patchOp);

	var domIndex = __commonjs(function (module) {
	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {};

	module.exports = domIndex;

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {};
	    } else {
	        indices.sort(ascending);
	        return recurse(rootNode, tree, indices, nodes, 0);
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {};

	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode;
	        }

	        var vChildren = tree.children;

	        if (vChildren) {

	            var childNodes = rootNode.childNodes;

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1;

	                var vChild = vChildren[i] || noChild;
	                var nextIndex = rootIndex + (vChild.count || 0);

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
	                }

	                rootIndex = nextIndex;
	            }
	        }
	    }

	    return nodes;
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false;
	    }

	    var minIndex = 0;
	    var maxIndex = indices.length - 1;
	    var currentIndex;
	    var currentItem;

	    while (minIndex <= maxIndex) {
	        currentIndex = (maxIndex + minIndex) / 2 >> 0;
	        currentItem = indices[currentIndex];

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right;
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1;
	        } else if (currentItem > right) {
	            maxIndex = currentIndex - 1;
	        } else {
	            return true;
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1;
	}
	});

	var require$$1$5 = (domIndex && typeof domIndex === 'object' && 'default' in domIndex ? domIndex['default'] : domIndex);

	var removeEventListener = __commonjs(function (module) {
	module.exports = removeEventListener;

	function removeEventListener(type, listener) {
	    var elem = this;

	    if (!elem.listeners) {
	        return;
	    }

	    if (!elem.listeners[type]) {
	        return;
	    }

	    var list = elem.listeners[type];
	    var index = list.indexOf(listener);
	    if (index !== -1) {
	        list.splice(index, 1);
	    }
	}
	});

	var require$$1$10 = (removeEventListener && typeof removeEventListener === 'object' && 'default' in removeEventListener ? removeEventListener['default'] : removeEventListener);

	var addEventListener = __commonjs(function (module) {
	module.exports = addEventListener;

	function addEventListener(type, listener) {
	    var elem = this;

	    if (!elem.listeners) {
	        elem.listeners = {};
	    }

	    if (!elem.listeners[type]) {
	        elem.listeners[type] = [];
	    }

	    if (elem.listeners[type].indexOf(listener) === -1) {
	        elem.listeners[type].push(listener);
	    }
	}
	});

	var require$$2$7 = (addEventListener && typeof addEventListener === 'object' && 'default' in addEventListener ? addEventListener['default'] : addEventListener);

	var dispatchEvent = __commonjs(function (module) {
	module.exports = dispatchEvent;

	function dispatchEvent(ev) {
	    var elem = this;
	    var type = ev.type;

	    if (!ev.target) {
	        ev.target = elem;
	    }

	    if (!elem.listeners) {
	        elem.listeners = {};
	    }

	    var listeners = elem.listeners[type];

	    if (listeners) {
	        return listeners.forEach(function (listener) {
	            ev.currentTarget = elem;
	            if (typeof listener === 'function') {
	                listener(ev);
	            } else {
	                listener.handleEvent(ev);
	            }
	        });
	    }

	    if (elem.parentNode) {
	        elem.parentNode.dispatchEvent(ev);
	    }
	}
	});

	var require$$3$5 = (dispatchEvent && typeof dispatchEvent === 'object' && 'default' in dispatchEvent ? dispatchEvent['default'] : dispatchEvent);

	var event = __commonjs(function (module) {
	module.exports = Event;

	function Event(family) {}

	Event.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
	    this.type = type;
	    this.bubbles = bubbles;
	    this.cancelable = cancelable;
	};

	Event.prototype.preventDefault = function _Event_preventDefault() {};
	});

	var require$$3$6 = (event && typeof event === 'object' && 'default' in event ? event['default'] : event);

	var serialize = __commonjs(function (module) {
	module.exports = serializeNode;

	var voidElements = /area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr/i;

	function serializeNode(node) {
	    switch (node.nodeType) {
	        case 3:
	            return escapeText(node.data);
	        case 8:
	            return "<!--" + node.data + "-->";
	        default:
	            return serializeElement(node);
	    }
	}

	function serializeElement(elem) {
	    var strings = [];

	    var tagname = elem.tagName;

	    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
	        tagname = tagname.toLowerCase();
	    }

	    strings.push("<" + tagname + properties(elem) + datasetify(elem));

	    if (voidElements.test(tagname)) {
	        strings.push(" />");
	    } else {
	        strings.push(">");

	        if (elem.childNodes.length) {
	            strings.push.apply(strings, elem.childNodes.map(serializeNode));
	        } else if (elem.textContent || elem.innerText) {
	            strings.push(escapeText(elem.textContent || elem.innerText));
	        } else if (elem.innerHTML) {
	            strings.push(elem.innerHTML);
	        }

	        strings.push("</" + tagname + ">");
	    }

	    return strings.join("");
	}

	function isProperty(elem, key) {
	    var type = babelHelpers.typeof(elem[key]);

	    if (key === "style" && Object.keys(elem.style).length > 0) {
	        return true;
	    }

	    return elem.hasOwnProperty(key) && (type === "string" || type === "boolean" || type === "number") && key !== "nodeName" && key !== "className" && key !== "tagName" && key !== "textContent" && key !== "innerText" && key !== "namespaceURI" && key !== "innerHTML";
	}

	function stylify(styles) {
	    var attr = "";
	    Object.keys(styles).forEach(function (key) {
	        var value = styles[key];
	        key = key.replace(/[A-Z]/g, function (c) {
	            return "-" + c.toLowerCase();
	        });
	        attr += key + ":" + value + ";";
	    });
	    return attr;
	}

	function datasetify(elem) {
	    var ds = elem.dataset;
	    var props = [];

	    for (var key in ds) {
	        props.push({ name: "data-" + key, value: ds[key] });
	    }

	    return props.length ? stringify(props) : "";
	}

	function stringify(list) {
	    var attributes = [];
	    list.forEach(function (tuple) {
	        var name = tuple.name;
	        var value = tuple.value;

	        if (name === "style") {
	            value = stylify(value);
	        }

	        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"");
	    });

	    return attributes.length ? " " + attributes.join(" ") : "";
	}

	function properties(elem) {
	    var props = [];
	    for (var key in elem) {
	        if (isProperty(elem, key)) {
	            props.push({ name: key, value: elem[key] });
	        }
	    }

	    for (var ns in elem._attributes) {
	        for (var attribute in elem._attributes[ns]) {
	            var prop = elem._attributes[ns][attribute];
	            var name = (prop.prefix ? prop.prefix + ":" : "") + attribute;
	            props.push({ name: name, value: prop.value });
	        }
	    }

	    if (elem.className) {
	        props.push({ name: "class", value: elem.className });
	    }

	    return props.length ? stringify(props) : "";
	}

	function escapeText(str) {
	    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	function escapeAttributeValue(str) {
	    return escapeText(str).replace(/"/g, "&quot;");
	}
	});

	var require$$0$25 = (serialize && typeof serialize === 'object' && 'default' in serialize ? serialize['default'] : serialize);

	var index$10 = __commonjs(function (module) {
	var slice = Array.prototype.slice;

	module.exports = iterativelyWalk;

	function iterativelyWalk(nodes, cb) {
	    if (!('length' in nodes)) {
	        nodes = [nodes];
	    }

	    nodes = slice.call(nodes);

	    while (nodes.length) {
	        var node = nodes.shift(),
	            ret = cb(node);

	        if (ret) {
	            return ret;
	        }

	        if (node.childNodes && node.childNodes.length) {
	            nodes = slice.call(node.childNodes).concat(nodes);
	        }
	    }
	}
	});

	var require$$4$5 = (index$10 && typeof index$10 === 'object' && 'default' in index$10 ? index$10['default'] : index$10);

	var domElement = __commonjs(function (module) {
	var domWalk = require$$4$5;
	var dispatchEvent = require$$3$5;
	var addEventListener = require$$2$7;
	var removeEventListener = require$$1$10;
	var serializeNode = require$$0$25;

	var htmlns = "http://www.w3.org/1999/xhtml";

	module.exports = DOMElement;

	function DOMElement(tagName, owner, namespace) {
	    if (!(this instanceof DOMElement)) {
	        return new DOMElement(tagName);
	    }

	    var ns = namespace === undefined ? htmlns : namespace || null;

	    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName;
	    this.className = "";
	    this.dataset = {};
	    this.childNodes = [];
	    this.parentNode = null;
	    this.style = {};
	    this.ownerDocument = owner || null;
	    this.namespaceURI = ns;
	    this._attributes = {};

	    if (this.tagName === 'INPUT') {
	        this.type = 'text';
	    }
	}

	DOMElement.prototype.type = "DOMElement";
	DOMElement.prototype.nodeType = 1;

	DOMElement.prototype.appendChild = function _Element_appendChild(child) {
	    if (child.parentNode) {
	        child.parentNode.removeChild(child);
	    }

	    this.childNodes.push(child);
	    child.parentNode = this;

	    return child;
	};

	DOMElement.prototype.replaceChild = function _Element_replaceChild(elem, needle) {
	    // TODO: Throw NotFoundError if needle.parentNode !== this

	    if (elem.parentNode) {
	        elem.parentNode.removeChild(elem);
	    }

	    var index = this.childNodes.indexOf(needle);

	    needle.parentNode = null;
	    this.childNodes[index] = elem;
	    elem.parentNode = this;

	    return needle;
	};

	DOMElement.prototype.removeChild = function _Element_removeChild(elem) {
	    // TODO: Throw NotFoundError if elem.parentNode !== this

	    var index = this.childNodes.indexOf(elem);
	    this.childNodes.splice(index, 1);

	    elem.parentNode = null;
	    return elem;
	};

	DOMElement.prototype.insertBefore = function _Element_insertBefore(elem, needle) {
	    // TODO: Throw NotFoundError if referenceElement is a dom node
	    // and parentNode !== this

	    if (elem.parentNode) {
	        elem.parentNode.removeChild(elem);
	    }

	    var index = needle === null || needle === undefined ? -1 : this.childNodes.indexOf(needle);

	    if (index > -1) {
	        this.childNodes.splice(index, 0, elem);
	    } else {
	        this.childNodes.push(elem);
	    }

	    elem.parentNode = this;
	    return elem;
	};

	DOMElement.prototype.setAttributeNS = function _Element_setAttributeNS(namespace, name, value) {
	    var prefix = null;
	    var localName = name;
	    var colonPosition = name.indexOf(":");
	    if (colonPosition > -1) {
	        prefix = name.substr(0, colonPosition);
	        localName = name.substr(colonPosition + 1);
	    }
	    var attributes = this._attributes[namespace] || (this._attributes[namespace] = {});
	    attributes[localName] = { value: value, prefix: prefix };
	};

	DOMElement.prototype.getAttributeNS = function _Element_getAttributeNS(namespace, name) {
	    var attributes = this._attributes[namespace];
	    var value = attributes && attributes[name] && attributes[name].value;
	    if (typeof value !== "string") {
	        return null;
	    }

	    return value;
	};

	DOMElement.prototype.removeAttributeNS = function _Element_removeAttributeNS(namespace, name) {
	    var attributes = this._attributes[namespace];
	    if (attributes) {
	        delete attributes[name];
	    }
	};

	DOMElement.prototype.hasAttributeNS = function _Element_hasAttributeNS(namespace, name) {
	    var attributes = this._attributes[namespace];
	    return !!attributes && name in attributes;
	};

	DOMElement.prototype.setAttribute = function _Element_setAttribute(name, value) {
	    return this.setAttributeNS(null, name, value);
	};

	DOMElement.prototype.getAttribute = function _Element_getAttribute(name) {
	    return this.getAttributeNS(null, name);
	};

	DOMElement.prototype.removeAttribute = function _Element_removeAttribute(name) {
	    return this.removeAttributeNS(null, name);
	};

	DOMElement.prototype.hasAttribute = function _Element_hasAttribute(name) {
	    return this.hasAttributeNS(null, name);
	};

	DOMElement.prototype.removeEventListener = removeEventListener;
	DOMElement.prototype.addEventListener = addEventListener;
	DOMElement.prototype.dispatchEvent = dispatchEvent;

	// Un-implemented
	DOMElement.prototype.focus = function _Element_focus() {
	    return void 0;
	};

	DOMElement.prototype.toString = function _Element_toString() {
	    return serializeNode(this);
	};

	DOMElement.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
	    var classes = classNames.split(" ");
	    var elems = [];

	    domWalk(this, function (node) {
	        if (node.nodeType === 1) {
	            var nodeClassName = node.className || "";
	            var nodeClasses = nodeClassName.split(" ");

	            if (classes.every(function (item) {
	                return nodeClasses.indexOf(item) !== -1;
	            })) {
	                elems.push(node);
	            }
	        }
	    });

	    return elems;
	};

	DOMElement.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
	    tagName = tagName.toLowerCase();
	    var elems = [];

	    domWalk(this.childNodes, function (node) {
	        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
	            elems.push(node);
	        }
	    });

	    return elems;
	};

	DOMElement.prototype.contains = function _Element_contains(element) {
	    return domWalk(this, function (node) {
	        return element === node;
	    }) || false;
	};
	});

	var require$$0$24 = (domElement && typeof domElement === 'object' && 'default' in domElement ? domElement['default'] : domElement);

	var domFragment = __commonjs(function (module) {
	var DOMElement = require$$0$24;

	module.exports = DocumentFragment;

	function DocumentFragment(owner) {
	    if (!(this instanceof DocumentFragment)) {
	        return new DocumentFragment();
	    }

	    this.childNodes = [];
	    this.parentNode = null;
	    this.ownerDocument = owner || null;
	}

	DocumentFragment.prototype.type = "DocumentFragment";
	DocumentFragment.prototype.nodeType = 11;
	DocumentFragment.prototype.nodeName = "#document-fragment";

	DocumentFragment.prototype.appendChild = DOMElement.prototype.appendChild;
	DocumentFragment.prototype.replaceChild = DOMElement.prototype.replaceChild;
	DocumentFragment.prototype.removeChild = DOMElement.prototype.removeChild;

	DocumentFragment.prototype.toString = function _DocumentFragment_toString() {
	    return this.childNodes.map(function (node) {
	        return String(node);
	    }).join("");
	};
	});

	var require$$4$4 = (domFragment && typeof domFragment === 'object' && 'default' in domFragment ? domFragment['default'] : domFragment);

	var domText = __commonjs(function (module) {
	module.exports = DOMText;

	function DOMText(value, owner) {
	    if (!(this instanceof DOMText)) {
	        return new DOMText(value);
	    }

	    this.data = value || "";
	    this.length = this.data.length;
	    this.ownerDocument = owner || null;
	}

	DOMText.prototype.type = "DOMTextNode";
	DOMText.prototype.nodeType = 3;

	DOMText.prototype.toString = function _Text_toString() {
	    return this.data;
	};

	DOMText.prototype.replaceData = function replaceData(index, length, value) {
	    var current = this.data;
	    var left = current.substring(0, index);
	    var right = current.substring(index + length, current.length);
	    this.data = left + value + right;
	    this.length = this.data.length;
	};
	});

	var require$$6$3 = (domText && typeof domText === 'object' && 'default' in domText ? domText['default'] : domText);

	var domComment = __commonjs(function (module) {
	module.exports = Comment;

	function Comment(data, owner) {
	    if (!(this instanceof Comment)) {
	        return new Comment(data, owner);
	    }

	    this.data = data;
	    this.nodeValue = data;
	    this.length = data.length;
	    this.ownerDocument = owner || null;
	}

	Comment.prototype.nodeType = 8;
	Comment.prototype.nodeName = "#comment";

	Comment.prototype.toString = function _Comment_toString() {
	    return "[object Comment]";
	};
	});

	var require$$7$2 = (domComment && typeof domComment === 'object' && 'default' in domComment ? domComment['default'] : domComment);

	var document$2 = __commonjs(function (module) {
	var domWalk = require$$4$5;

	var Comment = require$$7$2;
	var DOMText = require$$6$3;
	var DOMElement = require$$0$24;
	var DocumentFragment = require$$4$4;
	var Event = require$$3$6;
	var dispatchEvent = require$$3$5;
	var addEventListener = require$$2$7;
	var removeEventListener = require$$1$10;

	module.exports = Document;

	function Document() {
	    if (!(this instanceof Document)) {
	        return new Document();
	    }

	    this.head = this.createElement("head");
	    this.body = this.createElement("body");
	    this.documentElement = this.createElement("html");
	    this.documentElement.appendChild(this.head);
	    this.documentElement.appendChild(this.body);
	    this.childNodes = [this.documentElement];
	    this.nodeType = 9;
	}

	var proto = Document.prototype;
	proto.createTextNode = function createTextNode(value) {
	    return new DOMText(value, this);
	};

	proto.createElementNS = function createElementNS(namespace, tagName) {
	    var ns = namespace === null ? null : String(namespace);
	    return new DOMElement(tagName, this, ns);
	};

	proto.createElement = function createElement(tagName) {
	    return new DOMElement(tagName, this);
	};

	proto.createDocumentFragment = function createDocumentFragment() {
	    return new DocumentFragment(this);
	};

	proto.createEvent = function createEvent(family) {
	    return new Event(family);
	};

	proto.createComment = function createComment(data) {
	    return new Comment(data, this);
	};

	proto.getElementById = function getElementById(id) {
	    id = String(id);

	    var result = domWalk(this.childNodes, function (node) {
	        if (String(node.id) === id) {
	            return node;
	        }
	    });

	    return result || null;
	};

	proto.getElementsByClassName = DOMElement.prototype.getElementsByClassName;
	proto.getElementsByTagName = DOMElement.prototype.getElementsByTagName;
	proto.contains = DOMElement.prototype.contains;

	proto.removeEventListener = removeEventListener;
	proto.addEventListener = addEventListener;
	proto.dispatchEvent = dispatchEvent;
	});

	var require$$0$23 = (document$2 && typeof document$2 === 'object' && 'default' in document$2 ? document$2['default'] : document$2);

	var index$8 = __commonjs(function (module) {
	var Document = require$$0$23;

	module.exports = new Document();
	});

	var require$$0$22 = (index$8 && typeof index$8 === 'object' && 'default' in index$8 ? index$8['default'] : index$8);

	var document$1 = __commonjs(function (module, exports, global) {
	var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
	var minDoc = require$$0$22;

	if (typeof document$1 !== 'undefined') {
	    module.exports = document$1;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	});

	var require$$5$2 = (document$1 && typeof document$1 === 'object' && 'default' in document$1 ? document$1['default'] : document$1);

	var createElement = __commonjs(function (module) {
	var document = require$$5$2;

	var applyProperties = require$$4$2;

	var isVNode = require$$3$4;
	var isVText = require$$6$2;
	var isWidget = require$$2$5;
	var handleThunk = require$$1$6;

	module.exports = createElement;

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document;
	    var warn = opts ? opts.warn : null;

	    vnode = handleThunk(vnode).a;

	    if (isWidget(vnode)) {
	        return vnode.init();
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text);
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode);
	        }
	        return null;
	    }

	    var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);

	    var props = vnode.properties;
	    applyProperties(node, props);

	    var children = vnode.children;

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts);
	        if (childNode) {
	            node.appendChild(childNode);
	        }
	    }

	    return node;
	}
	});

	var require$$0$13 = (createElement && typeof createElement === 'object' && 'default' in createElement ? createElement['default'] : createElement);

	var patch$2 = __commonjs(function (module) {
	var document = require$$5$2;
	var isArray = require$$10$1;

	var render = require$$0$13;
	var domIndex = require$$1$5;
	var patchOp = require$$0$12;
	module.exports = patch;

	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {};
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch ? renderOptions.patch : patchRecursive;
	    renderOptions.render = renderOptions.render || render;

	    return renderOptions.patch(rootNode, patches, renderOptions);
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches);

	    if (indices.length === 0) {
	        return rootNode;
	    }

	    var index = domIndex(rootNode, patches.a, indices);
	    var ownerDocument = rootNode.ownerDocument;

	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument;
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i];
	        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
	    }

	    return rootNode;
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode;
	    }

	    var newNode;

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions);

	            if (domNode === rootNode) {
	                rootNode = newNode;
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions);

	        if (domNode === rootNode) {
	            rootNode = newNode;
	        }
	    }

	    return rootNode;
	}

	function patchIndices(patches) {
	    var indices = [];

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key));
	        }
	    }

	    return indices;
	}
	});

	var require$$0$11 = (patch$2 && typeof patch$2 === 'object' && 'default' in patch$2 ? patch$2['default'] : patch$2);

	var patch = __commonjs(function (module) {
	var patch = require$$0$11;

	module.exports = patch;
	});

	var patch$1 = (patch && typeof patch === 'object' && 'default' in patch ? patch['default'] : patch);

	var createElement$1 = __commonjs(function (module) {
	var createElement = require$$0$13;

	module.exports = createElement;
	});

	var createElement$2 = (createElement$1 && typeof createElement$1 === 'object' && 'default' in createElement$1 ? createElement$1['default'] : createElement$1);

	var mapOldTree = new WeakMap();
	var mapRootNode = new WeakMap();

	function render (render) {
	  return function (elem) {
	    var newTree = render(elem, h$1);
	    var oldTree = mapOldTree.get(elem);

	    // Keep track of the previous state.
	    mapOldTree.set(elem, newTree);

	    // If the old tree exists, we're diffing / patching.
	    // Otherwise we're doing the initial mount.
	    if (oldTree) {
	      patch$1(mapRootNode.get(elem), diff$1(oldTree, newTree));
	    } else {
	      var newRootNode = createElement$2(newTree);
	      mapRootNode.set(elem, newRootNode);
	      elem.appendChild(newRootNode);
	    }
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

	var require$$3 = (debounce && typeof debounce === 'object' && 'default' in debounce ? debounce['default'] : debounce);

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

	var element = __commonjs(function (module, exports, global) {
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

	var require$$0$3 = (element && typeof element === 'object' && 'default' in element ? element['default'] : element);

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

	var require$$3$1 = (getClosestIgnoredElement && typeof getClosestIgnoredElement === 'object' && 'default' in getClosestIgnoredElement ? getClosestIgnoredElement['default'] : getClosestIgnoredElement);

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
	    factory(exports, module, require$$4, require$$3$1, require$$2$1, require$$0$4, require$$0$1);
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

	var require$$3$2 = (propertiesCreated && typeof propertiesCreated === 'object' && 'default' in propertiesCreated ? propertiesCreated['default'] : propertiesCreated);

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

	var index$2 = __commonjs(function (module) {
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

	var require$$3$3 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var propertiesInit = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', 'object-assign', '../util/dash-case', '../util/data', '../util/empty'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$3$3, require$$2$4, require$$1$2, require$$0$9);
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
	    factory(exports, module, require$$1$2, require$$7$1, require$$6, require$$5$1, require$$4$1, require$$3$2, require$$2$2, require$$1$3, require$$0$6);
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

	var version = __commonjs(function (module, exports, global) {
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

	var require$$16 = (version && typeof version === 'object' && 'default' in version ? version['default'] : version);

	var render$1 = __commonjs(function (module, exports, global) {
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

	var require$$17 = (render$1 && typeof render$1 === 'object' && 'default' in render$1 ? render$1['default'] : render$1);

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

	var index$1 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', 'object-assign', './boolean', './number', './string'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$3$3, require$$2$3, require$$1$4, require$$0$7);
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

	var require$$19 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

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
	    factory(exports, module, require$$3$3, require$$1$1, require$$0$4);
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

	var index = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === 'function' && define.amd) {
	    define(['exports', 'module', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './defaults', './lifecycle/detached', './global/document-observer', './global/registry', './support/custom-elements', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree', './support/valid-custom-element'], factory);
	  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
	    factory(exports, module, require$$23, require$$7$1, require$$21, require$$1$1, require$$19, require$$18, require$$17, require$$16, require$$3$3, require$$14, require$$13, require$$12, require$$11, require$$10, require$$9, require$$0$4, require$$7, require$$0$3, require$$5, require$$0$2, require$$3, require$$1, require$$0$1, require$$0);
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

	var skate = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	function linkPropsToAttrsIfNotSpecified(props) {
	  Object.keys(props || {}).forEach(function (name) {
	    var prop = props[name];
	    if (typeof prop.attribute === 'undefined') {
	      prop.attribute = true;
	    }
	  });
	}

	function register (name, opts) {
	  linkPropsToAttrsIfNotSpecified(opts.properties);
	  opts.render = render(opts.render);
	  return skate(name, opts);
	}

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
	var map = [];
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

	function render$2 (elem) {
	  registry$1.find(elem).forEach(function (component) {
	    return component.render && component.render(elem);
	  });
	}

	function getState(elem) {
	  return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
	    prev[curr] = elem[curr];
	  }, {});
	}

	function setState(elem, newState) {
	  var ctor = elem.constructor;
	  var shouldUpdate = !ctor.update || ctor.update(elem) !== false;
	  require$$3$3(elem, newState);
	  if (shouldUpdate) {
	    render$2(elem);
	  }
	}

	function state (elem, newState) {
	  return typeof newState === 'undefined' ? getState(elem) : setState(elem);
	}

	var main = {
	  register: register,
	  render: render,
	  state: state
	};

	var previousGlobal = window.kickflip;
	main.noConflict = function noConflict() {
	  window.kickflip = previousGlobal;
	  return this;
	};
	window.kickflip = main;

	return main;

}));
//# sourceMappingURL=index.js.map