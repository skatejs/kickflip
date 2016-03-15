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

    babelHelpers.defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    babelHelpers;


    var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
    function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

    var internalData = {
      applyProp: {},
      shadowId: ''
    };

    var index$1 = __commonjs(function (module) {
    module.exports = Date.now || now;

    function now() {
        return new Date().getTime();
    }
    });

    var require$$0 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

    var index = __commonjs(function (module) {
    /**
     * Module dependencies.
     */

    var now = require$$0;

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     *
     * @source underscore.js
     * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
     * @param {Function} function to wrap
     * @param {Number} timeout in ms (`100`)
     * @param {Boolean} whether to execute at the beginning (`false`)
     * @api public
     */

    module.exports = function debounce(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      if (null == wait) wait = 100;

      function later() {
        var last = now() - timestamp;

        if (last < wait && last > 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };

      return function debounced() {
        context = this;
        args = arguments;
        timestamp = now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    };
    });

    var debounce = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

    var incrementalDomCjs = __commonjs(function (module, exports) {
    /**
     * @license
     * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    'use strict';

    /**
     * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /**
      * Keeps track whether or not we are in an attributes declaration (after
      * elementOpenStart, but before elementOpenEnd).
      * @type {boolean}
      */

    var inAttributes = false;

    /**
      * Keeps track whether or not we are in an element that should not have its
      * children cleared.
      * @type {boolean}
      */
    var inSkip = false;

    /**
     * Makes sure that there is a current patch context.
     * @param {*} context
     */
    var assertInPatch = function assertInPatch(context) {
      if (!context) {
        throw new Error('Cannot call currentElement() unless in patch');
      }
    };

    /**
    * Makes sure that keyed Element matches the tag name provided.
    * @param {!string} nodeName The nodeName of the node that is being matched.
    * @param {string=} tag The tag name of the Element.
    * @param {?string=} key The key of the Element.
    */
    var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
      if (nodeName !== tag) {
        throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
      }
    };

    /**
     * Makes sure that a patch closes every node that it opened.
     * @param {?Node} openElement
     * @param {!Node|!DocumentFragment} root
     */
    var assertNoUnclosedTags = function assertNoUnclosedTags(openElement, root) {
      if (openElement === root) {
        return;
      }

      var currentElement = openElement;
      var openTags = [];
      while (currentElement && currentElement !== root) {
        openTags.push(currentElement.nodeName.toLowerCase());
        currentElement = currentElement.parentNode;
      }

      throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
    };

    /**
     * Makes sure that the caller is not where attributes are expected.
     * @param {string} functionName
     */
    var assertNotInAttributes = function assertNotInAttributes(functionName) {
      if (inAttributes) {
        throw new Error(functionName + '() may not be called between ' + 'elementOpenStart() and elementOpenEnd().');
      }
    };

    /**
     * Makes sure that the caller is not inside an element that has declared skip.
     * @param {string} functionName
     */
    var assertNotInSkip = function assertNotInSkip(functionName) {
      if (inSkip) {
        throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
      }
    };

    /**
     * Makes sure that the caller is where attributes are expected.
     * @param {string} functionName
     */
    var assertInAttributes = function assertInAttributes(functionName) {
      if (!inAttributes) {
        throw new Error(functionName + '() must be called after ' + 'elementOpenStart().');
      }
    };

    /**
     * Makes sure the patch closes virtual attributes call
     */
    var assertVirtualAttributesClosed = function assertVirtualAttributesClosed() {
      if (inAttributes) {
        throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
      }
    };

    /**
      * Makes sure that placeholders have a key specified. Otherwise, conditional
      * placeholders and conditional elements next to placeholders will cause
      * placeholder elements to be re-used as non-placeholders and vice versa.
      * @param {string} key
      */
    var assertPlaceholderKeySpecified = function assertPlaceholderKeySpecified(key) {
      if (!key) {
        throw new Error('Placeholder elements must have a key specified.');
      }
    };

    /**
      * Makes sure that tags are correctly nested.
      * @param {string} nodeName
      * @param {string} tag
      */
    var assertCloseMatchesOpenTag = function assertCloseMatchesOpenTag(nodeName, tag) {
      if (nodeName !== tag) {
        throw new Error('Received a call to close ' + tag + ' but ' + nodeName + ' was open.');
      }
    };

    /**
     * Makes sure that no children elements have been declared yet in the current
     * element.
     * @param {string} functionName
     * @param {?Node} previousNode
     */
    var assertNoChildrenDeclaredYet = function assertNoChildrenDeclaredYet(functionName, previousNode) {
      if (previousNode !== null) {
        throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
      }
    };

    /**
     * Updates the state of being in an attribute declaration.
     * @param {boolean} value
     * @return {boolean} the previous value.
     */
    var setInAttributes = function setInAttributes(value) {
      var previous = inAttributes;
      inAttributes = value;
      return previous;
    };

    /**
     * Updates the state of being in a skip element.
     * @param {boolean} value
     * @return {boolean} the previous value.
     */
    var setInSkip = function setInSkip(value) {
      var previous = inSkip;
      inSkip = value;
      return previous;
    };

    /**
     * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /** */
    exports.notifications = {
      /**
       * Called after patch has compleated with any Nodes that have been created
       * and added to the DOM.
       * @type {?function(Array<!Node>)}
       */
      nodesCreated: null,

      /**
       * Called after patch has compleated with any Nodes that have been removed
       * from the DOM.
       * Note it's an applications responsibility to handle any childNodes.
       * @type {?function(Array<!Node>)}
       */
      nodesDeleted: null
    };

    /**
     * Keeps track of the state of a patch.
     * @constructor
     */
    function Context() {
      /**
       * @type {(Array<!Node>|undefined)}
       */
      this.created = exports.notifications.nodesCreated && [];

      /**
       * @type {(Array<!Node>|undefined)}
       */
      this.deleted = exports.notifications.nodesDeleted && [];
    }

    /**
     * @param {!Node} node
     */
    Context.prototype.markCreated = function (node) {
      if (this.created) {
        this.created.push(node);
      }
    };

    /**
     * @param {!Node} node
     */
    Context.prototype.markDeleted = function (node) {
      if (this.deleted) {
        this.deleted.push(node);
      }
    };

    /**
     * Notifies about nodes that were created during the patch opearation.
     */
    Context.prototype.notifyChanges = function () {
      if (this.created && this.created.length > 0) {
        exports.notifications.nodesCreated(this.created);
      }

      if (this.deleted && this.deleted.length > 0) {
        exports.notifications.nodesDeleted(this.deleted);
      }
    };

    /**
     * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /**
     * A cached reference to the hasOwnProperty function.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * A cached reference to the create function.
     */
    var create = Object.create;

    /**
     * Used to prevent property collisions between our "map" and its prototype.
     * @param {!Object<string, *>} map The map to check.
     * @param {string} property The property to check.
     * @return {boolean} Whether map has property.
     */
    var has = function has(map, property) {
      return hasOwnProperty.call(map, property);
    };

    /**
     * Creates an map object without a prototype.
     * @return {!Object}
     */
    var createMap = function createMap() {
      return create(null);
    };

    /**
     * Keeps track of information needed to perform diffs for a given DOM node.
     * @param {!string} nodeName
     * @param {?string=} key
     * @constructor
     */
    function NodeData(nodeName, key) {
      /**
       * The attributes and their values.
       * @const {!Object<string, *>}
       */
      this.attrs = createMap();

      /**
       * An array of attribute name/value pairs, used for quickly diffing the
       * incomming attributes to see if the DOM node's attributes need to be
       * updated.
       * @const {Array<*>}
       */
      this.attrsArr = [];

      /**
       * The incoming attributes for this Node, before they are updated.
       * @const {!Object<string, *>}
       */
      this.newAttrs = createMap();

      /**
       * The key used to identify this node, used to preserve DOM nodes when they
       * move within their parent.
       * @const
       */
      this.key = key;

      /**
       * Keeps track of children within this node by their key.
       * {?Object<string, !Element>}
       */
      this.keyMap = null;

      /**
       * Whether or not the keyMap is currently valid.
       * {boolean}
       */
      this.keyMapValid = true;

      /**
       * The node name for this node.
       * @const {string}
       */
      this.nodeName = nodeName;

      /**
       * @type {?string}
       */
      this.text = null;
    }

    /**
     * Initializes a NodeData object for a Node.
     *
     * @param {Node} node The node to initialize data for.
     * @param {string} nodeName The node name of node.
     * @param {?string=} key The key that identifies the node.
     * @return {!NodeData} The newly initialized data object
     */
    var initData = function initData(node, nodeName, key) {
      var data = new NodeData(nodeName, key);
      node['__incrementalDOMData'] = data;
      return data;
    };

    /**
     * Retrieves the NodeData object for a Node, creating it if necessary.
     *
     * @param {Node} node The node to retrieve the data for.
     * @return {!NodeData} The NodeData for this Node.
     */
    var getData = function getData(node) {
      var data = node['__incrementalDOMData'];

      if (!data) {
        var nodeName = node.nodeName.toLowerCase();
        var key = null;

        if (node instanceof Element) {
          key = node.getAttribute('key');
        }

        data = initData(node, nodeName, key);
      }

      return data;
    };

    /**
     * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    exports.symbols = {
      default: '__default',

      placeholder: '__placeholder'
    };

    /**
     * Applies an attribute or property to a given Element. If the value is null
     * or undefined, it is removed from the Element. Otherwise, the value is set
     * as an attribute.
     * @param {!Element} el
     * @param {string} name The attribute's name.
     * @param {?(boolean|number|string)=} value The attribute's value.
     */
    exports.applyAttr = function (el, name, value) {
      if (value == null) {
        el.removeAttribute(name);
      } else {
        el.setAttribute(name, value);
      }
    };

    /**
     * Applies a property to a given Element.
     * @param {!Element} el
     * @param {string} name The property's name.
     * @param {*} value The property's value.
     */
    exports.applyProp = function (el, name, value) {
      el[name] = value;
    };

    /**
     * Applies a style to an Element. No vendor prefix expansion is done for
     * property names/values.
     * @param {!Element} el
     * @param {string} name The attribute's name.
     * @param {*} style The style to set. Either a string of css or an object
     *     containing property-value pairs.
     */
    var applyStyle = function applyStyle(el, name, style) {
      if (typeof style === 'string') {
        el.style.cssText = style;
      } else {
        el.style.cssText = '';
        var elStyle = el.style;
        var obj = /** @type {!Object<string,string>} */style;

        for (var prop in obj) {
          if (has(obj, prop)) {
            elStyle[prop] = obj[prop];
          }
        }
      }
    };

    /**
     * Updates a single attribute on an Element.
     * @param {!Element} el
     * @param {string} name The attribute's name.
     * @param {*} value The attribute's value. If the value is an object or
     *     function it is set on the Element, otherwise, it is set as an HTML
     *     attribute.
     */
    var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
      var type = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);

      if (type === 'object' || type === 'function') {
        exports.applyProp(el, name, value);
      } else {
        exports.applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
      }
    };

    /**
     * Calls the appropriate attribute mutator for this attribute.
     * @param {!Element} el
     * @param {string} name The attribute's name.
     * @param {*} value The attribute's value.
     */
    var updateAttribute = function updateAttribute(el, name, value) {
      var data = getData(el);
      var attrs = data.attrs;

      if (attrs[name] === value) {
        return;
      }

      var mutator = exports.attributes[name] || exports.attributes[exports.symbols.default];
      mutator(el, name, value);

      attrs[name] = value;
    };

    /**
     * A publicly mutable object to provide custom mutators for attributes.
     * @const {!Object<string, function(!Element, string, *)>}
     */
    exports.attributes = createMap();

    // Special generic mutator that's called for any attribute that does not
    // have a specific mutator.
    exports.attributes[exports.symbols.default] = applyAttributeTyped;

    exports.attributes[exports.symbols.placeholder] = function () {};

    exports.attributes['style'] = applyStyle;

    /**
     * Gets the namespace to create an element (of a given tag) in.
     * @param {string} tag The tag to get the namespace for.
     * @param {?Node} parent
     * @return {?string} The namespace to create the tag in.
     */
    var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
      if (tag === 'svg') {
        return 'http://www.w3.org/2000/svg';
      }

      if (getData(parent).nodeName === 'foreignObject') {
        return null;
      }

      return parent.namespaceURI;
    };

    /**
     * Creates an Element.
     * @param {Document} doc The document with which to create the Element.
     * @param {?Node} parent
     * @param {string} tag The tag for the Element.
     * @param {?string=} key A key to identify the Element.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element.
     * @return {!Element}
     */
    var createElement = function createElement(doc, parent, tag, key, statics) {
      var namespace = getNamespaceForTag(tag, parent);
      var el;

      if (namespace) {
        el = doc.createElementNS(namespace, tag);
      } else {
        el = doc.createElement(tag);
      }

      initData(el, tag, key);

      if (statics) {
        for (var i = 0; i < statics.length; i += 2) {
          updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
        }
      }

      return el;
    };

    /**
     * Creates a Text Node.
     * @param {Document} doc The document with which to create the Element.
     * @return {!Text}
     */
    var createText = function createText(doc) {
      var node = doc.createTextNode('');
      initData(node, '#text', null);
      return node;
    };

    /**
     * Creates a mapping that can be used to look up children using a key.
     * @param {?Node} el
     * @return {!Object<string, !Element>} A mapping of keys to the children of the
     *     Element.
     */
    var createKeyMap = function createKeyMap(el) {
      var map = createMap();
      var children = el.children;
      var count = children.length;

      for (var i = 0; i < count; i += 1) {
        var child = children[i];
        var key = getData(child).key;

        if (key) {
          map[key] = child;
        }
      }

      return map;
    };

    /**
     * Retrieves the mapping of key to child node for a given Element, creating it
     * if necessary.
     * @param {?Node} el
     * @return {!Object<string, !Node>} A mapping of keys to child Elements
     */
    var getKeyMap = function getKeyMap(el) {
      var data = getData(el);

      if (!data.keyMap) {
        data.keyMap = createKeyMap(el);
      }

      return data.keyMap;
    };

    /**
     * Retrieves a child from the parent with the given key.
     * @param {?Node} parent
     * @param {?string=} key
     * @return {?Node} The child corresponding to the key.
     */
    var getChild = function getChild(parent, key) {
      return key ? getKeyMap(parent)[key] : null;
    };

    /**
     * Registers an element as being a child. The parent will keep track of the
     * child using the key. The child can be retrieved using the same key using
     * getKeyMap. The provided key should be unique within the parent Element.
     * @param {?Node} parent The parent of child.
     * @param {string} key A key to identify the child with.
     * @param {!Node} child The child to register.
     */
    var registerChild = function registerChild(parent, key, child) {
      getKeyMap(parent)[key] = child;
    };

    /** @type {?Context} */
    var context = null;

    /** @type {?Node} */
    var currentNode;

    /** @type {?Node} */
    var currentParent;

    /** @type {?Node} */
    var previousNode;

    /** @type {?Element|?DocumentFragment} */
    var root;

    /** @type {?Document} */
    var doc;

    /**
     * Patches the document starting at el with the provided function. This function
     * may be called during an existing patch operation.
     * @param {!Element|!DocumentFragment} node The Element or Document
     *     to patch.
     * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
     *     calls that describe the DOM.
     * @param {T=} data An argument passed to fn to represent DOM state.
     * @template T
     */
    exports.patch = function (node, fn, data) {
      var prevContext = context;
      var prevRoot = root;
      var prevDoc = doc;
      var prevCurrentNode = currentNode;
      var prevCurrentParent = currentParent;
      var prevPreviousNode = previousNode;
      var previousInAttributes = false;
      var previousInSkip = false;

      context = new Context();
      root = node;
      doc = node.ownerDocument;
      currentNode = node;
      currentParent = null;
      previousNode = null;

      if (process.env.NODE_ENV !== 'production') {
        previousInAttributes = setInAttributes(false);
        previousInSkip = setInSkip(false);
      }

      enterNode();
      fn(data);
      exitNode();

      if (process.env.NODE_ENV !== 'production') {
        assertVirtualAttributesClosed();
        assertNoUnclosedTags(previousNode, node);
        setInAttributes(previousInAttributes);
        setInSkip(previousInSkip);
      }

      context.notifyChanges();

      context = prevContext;
      root = prevRoot;
      doc = prevDoc;
      currentNode = prevCurrentNode;
      currentParent = prevCurrentParent;
      previousNode = prevPreviousNode;
    };

    /**
     * Checks whether or not the current node matches the specified nodeName and
     * key.
     *
     * @param {?string} nodeName The nodeName for this node.
     * @param {?string=} key An optional key that identifies a node.
     * @return {boolean} True if the node matches, false otherwise.
     */
    var matches = function matches(nodeName, key) {
      var data = getData(currentNode);

      // Key check is done using double equals as we want to treat a null key the
      // same as undefined. This should be okay as the only values allowed are
      // strings, null and undefined so the == semantics are not too weird.
      return nodeName === data.nodeName && key == data.key;
    };

    /**
     * Aligns the virtual Element definition with the actual DOM, moving the
     * corresponding DOM node to the correct location or creating it if necessary.
     * @param {string} nodeName For an Element, this should be a valid tag string.
     *     For a Text, this should be #text.
     * @param {?string=} key The key used to identify this element.
     * @param {?Array<*>=} statics For an Element, this should be an array of
     *     name-value pairs.
     */
    var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
      if (currentNode && matches(nodeName, key)) {
        return;
      }

      var node;

      // Check to see if the node has moved within the parent.
      if (key) {
        node = getChild(currentParent, key);
        if (node && process.env.NODE_ENV !== 'production') {
          assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
        }
      }

      // Create the node if it doesn't exist.
      if (!node) {
        if (nodeName === '#text') {
          node = createText(doc);
        } else {
          node = createElement(doc, currentParent, nodeName, key, statics);
        }

        if (key) {
          registerChild(currentParent, key, node);
        }

        context.markCreated(node);
      }

      // If the node has a key, remove it from the DOM to prevent a large number
      // of re-orders in the case that it moved far or was completely removed.
      // Since we hold on to a reference through the keyMap, we can always add it
      // back.
      if (currentNode && getData(currentNode).key) {
        currentParent.replaceChild(node, currentNode);
        getData(currentParent).keyMapValid = false;
      } else {
        currentParent.insertBefore(node, currentNode);
      }

      currentNode = node;
    };

    /**
     * Clears out any unvisited Nodes, as the corresponding virtual element
     * functions were never called for them.
     */
    var clearUnvisitedDOM = function clearUnvisitedDOM() {
      var node = currentParent;
      var data = getData(node);
      var keyMap = data.keyMap;
      var keyMapValid = data.keyMapValid;
      var child = node.lastChild;
      var key;

      if (child === previousNode && keyMapValid) {
        return;
      }

      if (data.attrs[exports.symbols.placeholder] && node !== root) {
        return;
      }

      while (child !== previousNode) {
        node.removeChild(child);
        context.markDeleted( /** @type {!Node}*/child);

        key = getData(child).key;
        if (key) {
          delete keyMap[key];
        }
        child = node.lastChild;
      }

      // Clean the keyMap, removing any unusued keys.
      if (!keyMapValid) {
        for (key in keyMap) {
          child = keyMap[key];
          if (child.parentNode !== node) {
            context.markDeleted(child);
            delete keyMap[key];
          }
        }

        data.keyMapValid = true;
      }
    };

    /**
     * Changes to the first child of the current node.
     */
    var enterNode = function enterNode() {
      currentParent = currentNode;
      currentNode = currentNode.firstChild;
      previousNode = null;
    };

    /**
     * Changes to the next sibling of the current node.
     */
    var nextNode = function nextNode() {
      previousNode = currentNode;
      currentNode = currentNode.nextSibling;
    };

    /**
     * Changes to the parent of the current node, removing any unvisited children.
     */
    var exitNode = function exitNode() {
      clearUnvisitedDOM();

      previousNode = currentParent;
      currentNode = currentParent.nextSibling;
      currentParent = currentParent.parentNode;
    };

    /**
     * Makes sure that the current node is an Element with a matching tagName and
     * key.
     *
     * @param {string} tag The element's tag.
     * @param {?string=} key The key used to identify this element. This can be an
     *     empty string, but performance may be better if a unique value is used
     *     when iterating over an array of items.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element. These will only be set once when the
     *     Element is created.
     * @return {!Element} The corresponding Element.
     */
    var _elementOpen = function _elementOpen(tag, key, statics) {
      alignWithDOM(tag, key, statics);
      enterNode();
      return (/** @type {!Element} */currentParent
      );
    };

    /**
     * Closes the currently open Element, removing any unvisited children if
     * necessary.
     *
     * @return {!Element} The corresponding Element.
     */
    var _elementClose = function _elementClose() {
      if (process.env.NODE_ENV !== 'production') {
        setInSkip(false);
      }

      exitNode();
      return (/** @type {!Element} */previousNode
      );
    };

    /**
     * Makes sure the current node is a Text node and creates a Text node if it is
     * not.
     *
     * @return {!Text} The corresponding Text Node.
     */
    var _text = function _text() {
      alignWithDOM('#text', null, null);
      nextNode();
      return (/** @type {!Text} */previousNode
      );
    };

    /**
     * Gets the current Element being patched.
     * @return {!Element}
     */
    exports.currentElement = function () {
      if (process.env.NODE_ENV !== 'production') {
        assertInPatch(context);
        assertNotInAttributes('currentElement');
      }
      return (/** @type {!Element} */currentParent
      );
    };

    /**
     * Skips the children in a subtree, allowing an Element to be closed without
     * clearing out the children.
     */
    exports.skip = function () {
      if (process.env.NODE_ENV !== 'production') {
        assertNoChildrenDeclaredYet('skip', previousNode);
        setInSkip(true);
      }
      previousNode = currentParent.lastChild;
    };

    /**
     * The offset in the virtual element declaration where the attributes are
     * specified.
     * @const
     */
    var ATTRIBUTES_OFFSET = 3;

    /**
     * Builds an array of arguments for use with elementOpenStart, attr and
     * elementOpenEnd.
     * @const {Array<*>}
     */
    var argsBuilder = [];

    /**
     * @param {string} tag The element's tag.
     * @param {?string=} key The key used to identify this element. This can be an
     *     empty string, but performance may be better if a unique value is used
     *     when iterating over an array of items.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element. These will only be set once when the
     *     Element is created.
     * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
     *     for the Element.
     * @return {!Element} The corresponding Element.
     */
    exports.elementOpen = function (tag, key, statics, var_args) {
      if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementOpen');
        assertNotInSkip('elementOpen');
      }

      var node = _elementOpen(tag, key, statics);
      var data = getData(node);

      /*
       * Checks to see if one or more attributes have changed for a given Element.
       * When no attributes have changed, this is much faster than checking each
       * individual argument. When attributes have changed, the overhead of this is
       * minimal.
       */
      var attrsArr = data.attrsArr;
      var newAttrs = data.newAttrs;
      var attrsChanged = false;
      var i = ATTRIBUTES_OFFSET;
      var j = 0;

      for (; i < arguments.length; i += 1, j += 1) {
        if (attrsArr[j] !== arguments[i]) {
          attrsChanged = true;
          break;
        }
      }

      for (; i < arguments.length; i += 1, j += 1) {
        attrsArr[j] = arguments[i];
      }

      if (j < attrsArr.length) {
        attrsChanged = true;
        attrsArr.length = j;
      }

      /*
       * Actually perform the attribute update.
       */
      if (attrsChanged) {
        for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
          newAttrs[arguments[i]] = arguments[i + 1];
        }

        for (var attr in newAttrs) {
          updateAttribute(node, attr, newAttrs[attr]);
          newAttrs[attr] = undefined;
        }
      }

      return node;
    };

    /**
     * Declares a virtual Element at the current location in the document. This
     * corresponds to an opening tag and a elementClose tag is required. This is
     * like elementOpen, but the attributes are defined using the attr function
     * rather than being passed as arguments. Must be folllowed by 0 or more calls
     * to attr, then a call to elementOpenEnd.
     * @param {string} tag The element's tag.
     * @param {?string=} key The key used to identify this element. This can be an
     *     empty string, but performance may be better if a unique value is used
     *     when iterating over an array of items.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element. These will only be set once when the
     *     Element is created.
     */
    exports.elementOpenStart = function (tag, key, statics) {
      if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementOpenStart');
        setInAttributes(true);
      }

      argsBuilder[0] = tag;
      argsBuilder[1] = key;
      argsBuilder[2] = statics;
    };

    /***
     * Defines a virtual attribute at this point of the DOM. This is only valid
     * when called between elementOpenStart and elementOpenEnd.
     *
     * @param {string} name
     * @param {*} value
     */
    exports.attr = function (name, value) {
      if (process.env.NODE_ENV !== 'production') {
        assertInAttributes('attr');
      }

      argsBuilder.push(name, value);
    };

    /**
     * Closes an open tag started with elementOpenStart.
     * @return {!Element} The corresponding Element.
     */
    exports.elementOpenEnd = function () {
      if (process.env.NODE_ENV !== 'production') {
        assertInAttributes('elementOpenEnd');
        setInAttributes(false);
      }

      var node = exports.elementOpen.apply(null, argsBuilder);
      argsBuilder.length = 0;
      return node;
    };

    /**
     * Closes an open virtual Element.
     *
     * @param {string} tag The element's tag.
     * @return {!Element} The corresponding Element.
     */
    exports.elementClose = function (tag) {
      if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementClose');
      }

      var node = _elementClose();

      if (process.env.NODE_ENV !== 'production') {
        assertCloseMatchesOpenTag(getData(node).nodeName, tag);
      }

      return node;
    };

    /**
     * Declares a virtual Element at the current location in the document that has
     * no children.
     * @param {string} tag The element's tag.
     * @param {?string=} key The key used to identify this element. This can be an
     *     empty string, but performance may be better if a unique value is used
     *     when iterating over an array of items.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element. These will only be set once when the
     *     Element is created.
     * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
     *     for the Element.
     * @return {!Element} The corresponding Element.
     */
    exports.elementVoid = function (tag, key, statics, var_args) {
      var node = exports.elementOpen.apply(null, arguments);
      exports.elementClose.apply(null, arguments);
      return node;
    };

    /**
     * Declares a virtual Element at the current location in the document that is a
     * placeholder element. Children of this Element can be manually managed and
     * will not be cleared by the library.
     *
     * A key must be specified to make sure that this node is correctly preserved
     * across all conditionals.
     *
     * @param {string} tag The element's tag.
     * @param {string} key The key used to identify this element.
     * @param {?Array<*>=} statics An array of attribute name/value pairs of the
     *     static attributes for the Element. These will only be set once when the
     *     Element is created.
     * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
     *     for the Element.
     * @return {!Element} The corresponding Element.
     */
    exports.elementPlaceholder = function (tag, key, statics, var_args) {
      if (process.env.NODE_ENV !== 'production') {
        assertPlaceholderKeySpecified(key);
      }

      exports.elementOpen.apply(null, arguments);
      exports.skip();
      return exports.elementClose.apply(null, arguments);
    };

    /**
     * Declares a virtual Text at this point in the document.
     *
     * @param {string|number|boolean} value The value of the Text.
     * @param {...(function((string|number|boolean)):string)} var_args
     *     Functions to format the value which are called only when the value has
     *     changed.
     * @return {!Text} The corresponding text node.
     */
    exports.text = function (value, var_args) {
      if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('text');
        assertNotInSkip('text');
      }

      var node = _text();
      var data = getData(node);

      if (data.text !== value) {
        data.text = /** @type {string} */value;

        var formatted = value;
        for (var i = 1; i < arguments.length; i += 1) {
          formatted = arguments[i](formatted);
        }

        node.data = formatted;
      }

      return node;
    };
    });

    var text = incrementalDomCjs.text;
    var elementClose = incrementalDomCjs.elementClose;
    var elementOpenEnd = incrementalDomCjs.elementOpenEnd;
    var attr = incrementalDomCjs.attr;
    var elementOpenStart = incrementalDomCjs.elementOpenStart;
    var elementOpen = incrementalDomCjs.elementOpen;
    var skip = incrementalDomCjs.skip;
    var patch = incrementalDomCjs.patch;
    var attributes = incrementalDomCjs.attributes;
    var applyProp = incrementalDomCjs.applyProp;
    var symbols = incrementalDomCjs.symbols;

    var prop = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.prop = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = Object.defineProperty.bind(Object);
      module.exports = exports['default'];
    });
    });

    var require$$0$2 = (prop && typeof prop === 'object' && 'default' in prop ? prop['default'] : prop);

    var mapPolyfilled = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.mapPolyfilled = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = new WeakMap();
      module.exports = exports['default'];
    });
    });

    var require$$1 = (mapPolyfilled && typeof mapPolyfilled === 'object' && 'default' in mapPolyfilled ? mapPolyfilled['default'] : mapPolyfilled);

    var polyfill = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './internal/map-polyfilled', './internal/prop'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$1, require$$0$2);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.mapPolyfilled, global.prop);
        global.polyfill = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _mapPolyfilled, _prop) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (elem) {
        if (_mapPolyfilled2.default.get(elem)) {
          return;
        }

        // Polyfill properties.
        for (var name in props) {
          (0, _prop2.default)(elem, name, props[name]);
        }

        // Polyfill methods.
        for (var name in funcs) {
          elem[name] = funcs[name];
        }

        _mapPolyfilled2.default.set(elem, true);
        return elem;
      };

      var _mapPolyfilled2 = _interopRequireDefault(_mapPolyfilled);

      var _prop2 = _interopRequireDefault(_prop);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function applyParentNode(node, parent) {
        (0, _prop2.default)(node, 'parentNode', {
          configurable: true,
          get: function get() {
            return parent;
          }
        });
      }

      function removeParentNode(node) {
        (0, _prop2.default)(node, 'parentNode', {
          configurable: true,
          get: function get() {
            return null;
          }
        });
      }

      function arrayItem(idx) {
        return this[idx];
      }

      function doForNodesIfSlot(elem, node, func) {
        nodeToArray(node).forEach(function (node) {
          var slot = getSlot(elem, node);

          if (slot) {
            func(elem, node, slot);
          }
        });
      }

      function getSlot(elem, node) {
        if (!node) {
          return;
        }

        var name = node.getAttribute && node.getAttribute('slot') || 'content';

        if (!elem.__slots) {
          elem.__slots = {};
        }

        var slots = elem.__slots;

        if (typeof slots[name] === 'undefined') {
          var slot = elem.querySelector('[slot-name="' + (elem.__shadowId || '') + (name === 'content' ? '' : name) + '"]');

          if (slot) {
            slots[name] = slot;
          }
        }

        if (slots[name]) {
          return slots[name];
        }
      }

      function makeLikeNodeList(arr) {
        arr.item = arrayItem;
        return arr;
      }

      function nodeToArray(node) {
        return node instanceof DocumentFragment ? toArray(node.childNodes) : [node];
      }

      function toArray(obj) {
        return Array.prototype.slice.call(obj);
      }

      var props = {
        childElementCount: {
          get: function get() {
            return this.children.length;
          }
        },
        childNodes: {
          get: function get() {
            var nodes = [];
            var slots = this.__slots;

            if (slots) {
              for (var name in slots) {
                var slot = slots[name];
                var childNodes = slot.childNodes;
                var childNodesLen = childNodes.length;

                for (var a = 0; a < childNodesLen; a++) {
                  nodes.push(childNodes[a]);
                }
              }
            }

            return makeLikeNodeList(nodes);
          }
        },
        children: {
          get: function get() {
            return makeLikeNodeList(this.childNodes.filter(function (node) {
              return node.nodeType === 1;
            }));
          }
        },
        firstChild: {
          get: function get() {
            return this.childNodes[0] || null;
          }
        },
        firstElementChild: {
          get: function get() {
            return this.children[0] || null;
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
            var frag = document.createDocumentFragment();
            div.innerHTML = val;

            while (this.hasChildNodes()) {
              this.removeChild(this.firstChild);
            }

            while (div.hasChildNodes()) {
              frag.appendChild(div.firstChild);
            }

            this.appendChild(frag);
          }
        },
        lastChild: {
          get: function get() {
            var ch = this.childNodes;
            return ch[ch.length - 1] || null;
          }
        },
        lastElementChild: {
          get: function get() {
            var ch = this.children;
            return ch[ch.length - 1] || null;
          }
        },
        outerHTML: {
          get: function get() {
            var name = this.tagName.toLowerCase();
            var attributes = toArray(this.attributes).map(function (attr) {
              return ' ' + attr.name + (attr.value ? '="' + attr.value + '"' : '');
            }).join('');
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
            doForNodesIfSlot(this, val.toString(), function (elem, node, slot) {
              slot.textContent = node;
            });
          }
        }
      };
      var funcs = {
        appendChild: function appendChild(newNode) {
          doForNodesIfSlot(this, newNode, function (elem, node, slot) {
            slot.appendChild(node);
            applyParentNode(node, elem);
          });
          return newNode;
        },
        hasChildNodes: function hasChildNodes() {
          return this.childNodes.length > 0;
        },
        insertBefore: function insertBefore(newNode, refNode) {
          doForNodesIfSlot(this, newNode, function (elem, node, slot) {
            slot.insertBefore(node, refNode);
            applyParentNode(node, elem);
          });
          return newNode;
        },
        removeChild: function removeChild(refNode) {
          doForNodesIfSlot(this, refNode, function (elem, node, slot) {
            slot.removeChild(node);
            removeParentNode(node);
          });
          return refNode;
        },
        replaceChild: function replaceChild(newNode, refNode) {
          doForNodesIfSlot(this, newNode, function (elem, node, slot) {
            slot.replaceChild(node, refNode);
            applyParentNode(node, elem);
          });
          removeParentNode(refNode);
          return refNode;
        }
      };
      module.exports = exports['default'];
    });
    });

    var require$$0$1 = (polyfill && typeof polyfill === 'object' && 'default' in polyfill ? polyfill['default'] : polyfill);

    var render$2 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './polyfill'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$1);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.polyfill);
        global.render = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _polyfill) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (fn) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? defaults : arguments[1];

        return function (elem) {
          var shadowRoot = elem.__shadowRoot;

          if (shadowRoot) {
            fn(elem, shadowRoot);
          } else {
            // We get a fragment of the initial DOM so that we can create the shadow
            // root.
            var initialLightDom = createFragmentFromChildNodes(elem);

            // Create a shadow ID so that it can be used to get a slot that is unique
            // to this shadow root. Since we don't polyfill querySelector() et al, we
            // need a way to be able to refer to slots that are unique to this
            // shadow root.
            elem.__shadowId = opts.shadowId;

            // Create the shadow root and return the light DOM. We must get the light
            // DOM before we template it so that we can distribute it after
            // polyfilling.
            elem.__shadowRoot = createShadowRoot(elem);

            // Render once we have the initial light DOM as this would likely blow
            // that away.
            fn(elem, elem.__shadowRoot);

            // Now polyfill so that we can distribute after.
            (0, _polyfill2.default)(elem);

            // Distribute the initial light DOM after polyfill so they get put into
            // the right spots.
            elem.appendChild(initialLightDom);
          }
        };
      };

      var _polyfill2 = _interopRequireDefault(_polyfill);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var shadowId = 0;

      function createFragmentFromChildNodes(elem) {
        var frag = document.createDocumentFragment();

        while (elem.hasChildNodes()) {
          frag.appendChild(elem.firstChild);
        }

        return frag;
      }

      function createShadowRoot(elem) {
        var root = document.createElement(isBlockLevel(elem) ? 'div' : 'span');
        elem.appendChild(root);
        return root;
      }

      function isBlockLevel(elem) {
        return window.getComputedStyle(elem).display === 'block';
      }

      var defaults = {
        shadowId: ''
      };
      module.exports = exports['default'];
    });
    });

    var render$3 = (render$2 && typeof render$2 === 'object' && 'default' in render$2 ? render$2['default'] : render$2);

    var shadowIdCount = 0;
    function render$1 (opts) {
      var internalRenderer = opts.render;

      if (!internalRenderer) {
        return;
      }

      // Keep the internal shadow ID static as this is used to locate the slots
      // that belong to the shadow root excluding any that may belong to descendant
      // components of the shadow root.
      var internalShadowId = ++shadowIdCount;

      return render$3(function (elem, shadowRoot) {
        // Record the current shadow ID so we can restore it.
        var shadowId = internalData.shadowId;

        // Set the new shadow ID so that the vDOM API can use it.
        internalData.shadowId = internalShadowId;

        // Patch once the shadow ID is set.
        patch(shadowRoot, internalRenderer, elem);

        // Restore to the previous ID so that any subsequent elements refer to the
        // proper scope.
        internalData.shadowId = shadowId;
      }, {
        shadowId: internalShadowId
      });
    }

    var ignored = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.ignored = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (element) {
        var attrs = element.attributes;
        return attrs && !!attrs['data-skate-ignore'];
      };

      module.exports = exports['default'];
    });
    });

    var require$$0$4 = (ignored && typeof ignored === 'object' && 'default' in ignored ? ignored['default'] : ignored);

    var walkTree = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './ignored'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$4);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.ignored);
        global.walkTree = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _ignored) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (elems, fn) {
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

      var _ignored2 = _interopRequireDefault(_ignored);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var Node = window.Node;

      function walk(elem, fn) {
        if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2.default)(elem)) {
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

      module.exports = exports['default'];
    });
    });

    var require$$0$3 = (walkTree && typeof walkTree === 'object' && 'default' in walkTree ? walkTree['default'] : walkTree);

    var defineProperties = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.defineProperties = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (obj, props) {
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

      module.exports = exports['default'];
    });
    });

    var require$$1$1 = (defineProperties && typeof defineProperties === 'object' && 'default' in defineProperties ? defineProperties['default'] : defineProperties);

    var debounce$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.debounce = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (fn) {
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

      module.exports = exports['default'];
    });
    });

    var require$$2 = (debounce$1 && typeof debounce$1 === 'object' && 'default' in debounce$1 ? debounce$1['default'] : debounce$1);

    var getOwnPropertyDescriptors = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.getOwnPropertyDescriptors = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (obj) {
        return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
          prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
          return prev;
        }, {});
      };

      module.exports = exports['default'];
    });
    });

    var require$$0$5 = (getOwnPropertyDescriptors && typeof getOwnPropertyDescriptors === 'object' && 'default' in getOwnPropertyDescriptors ? getOwnPropertyDescriptors['default'] : getOwnPropertyDescriptors);

    var protos = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.protos = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (proto) {
        var chains = [];
        while (proto) {
          chains.push(proto);
          proto = Object.getPrototypeOf(proto);
        }
        chains.reverse();
        return chains;
      };

      module.exports = exports['default'];
    });
    });

    var require$$2$1 = (protos && typeof protos === 'object' && 'default' in protos ? protos['default'] : protos);

    var getAllPropertyDescriptors = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './get-own-property-descriptors', './protos'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$5, require$$2$1);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.getOwnPropertyDescriptors, global.protos);
        global.getAllPropertyDescriptors = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _getOwnPropertyDescriptors, _protos) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (obj) {
        return (0, _protos2.default)(obj).reduce(function (result, proto) {
          var descriptors = (0, _getOwnPropertyDescriptors2.default)(proto);
          Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
            result[name] = descriptors[name];
            return result;
          }, result);
          return result;
        }, {});
      };

      var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

      var _protos2 = _interopRequireDefault(_protos);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$4 = (getAllPropertyDescriptors && typeof getAllPropertyDescriptors === 'object' && 'default' in getAllPropertyDescriptors ? getAllPropertyDescriptors['default'] : getAllPropertyDescriptors);

    var registerElement = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.registerElement = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var re = Document.prototype.registerElement;
      exports.default = re && re.bind(document);
      module.exports = exports['default'];
    });
    });

    var require$$0$7 = (registerElement && typeof registerElement === 'object' && 'default' in registerElement ? registerElement['default'] : registerElement);

    var createElement = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.createElement = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = Document.prototype.createElement.bind(document);
      module.exports = exports['default'];
    });
    });

    var require$$2$2 = (createElement && typeof createElement === 'object' && 'default' in createElement ? createElement['default'] : createElement);

    var element = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../native/create-element', '../native/register-element'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$2$2, require$$0$7);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.createElement, global.registerElement);
        global.element = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _createElement, _registerElement) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _createElement2 = _interopRequireDefault(_createElement);

      var _registerElement2 = _interopRequireDefault(_registerElement);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
      var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];

      exports.default = {
        create: function create(Ctor) {
          var elem = Ctor.extends ? (0, _createElement2.default)(Ctor.extends, Ctor.id) : (0, _createElement2.default)(Ctor.id);
          if (!Ctor.isNative && Ctor.extends) {
            elem.setAttribute('is', Ctor.id);
          }
          return elem;
        },
        reduce: function reduce(elem, defs) {
          var tagName = elem.tagName;
          var tagNameLc = tagName && tagName.toLowerCase();
          if (tagNameLc in defs) {
            return defs[tagNameLc];
          }

          var attributes = elem.attributes;
          var isAttributeNode = attributes && attributes.is;
          var isAttributeValue = isAttributeNode && isAttributeNode.value;
          if (isAttributeValue in defs) {
            return defs[isAttributeValue];
          }
        },
        register: function register(Ctor) {
          var name = Ctor.id;

          // Screen non-native names and try and be more helpful than native.
          if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
            throw new Error(name + ' is not a valid custom element name. A custom element name must: ' + customElementCriteria.map(function (a) {
              return '\n- ' + a;
            }).join(''));
          }

          // In native, we have to massage the definition so that the browser doesn't
          // spit out errors for a malformed definition.
          if (Ctor.isNative) {
            var nativeDefinition = { prototype: Ctor.prototype };
            Ctor.extends && (nativeDefinition.extends = Ctor.extends);
            (0, _registerElement2.default)(name, nativeDefinition);
          }
        }
      };
      module.exports = exports['default'];
    });
    });

    var require$$0$6 = (element && typeof element === 'object' && 'default' in element ? element['default'] : element);

    var vars = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.vars = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      // This should only be changed / incremented when the internal shared API
      // changes in a backward incompatible way. It's designed to be shared with
      // other Skate versions if it's compatible for performance reasons and also
      // to align with the spec since in native there is a global registry.
      var VERSION = '__skate_0_16_0';

      if (!window[VERSION]) {
        window[VERSION] = {
          registerIfNotExists: function registerIfNotExists(name, value) {
            return this[name] || (this[name] = value);
          }
        };
      }

      exports.default = window[VERSION];
      module.exports = exports['default'];
    });
    });

    var require$$3 = (vars && typeof vars === 'object' && 'default' in vars ? vars['default'] : vars);

    var registry = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './vars'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$3);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.vars);
        global.registry = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _vars) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _vars2 = _interopRequireDefault(_vars);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var definitions = {};
      var map = [];
      var types = [];
      var hasOwn = Object.prototype.hasOwnProperty;

      exports.default = _vars2.default.registerIfNotExists('registry', {
        get: function get(name) {
          return hasOwn.call(definitions, name) && definitions[name];
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
          var typesLength = types.length;
          for (var a = 0; a < typesLength; a++) {
            var reduced = types[a].reduce(elem, map[a]);
            if (reduced) {
              return reduced;
            }
          }
        }
      });
      module.exports = exports['default'];
    });
    });

    var require$$0$8 = (registry && typeof registry === 'object' && 'default' in registry ? registry['default'] : registry);

    var createEvent = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.createEvent = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = Document.prototype.createEvent.bind(document);
      module.exports = exports['default'];
    });
    });

    var require$$1$2 = (createEvent && typeof createEvent === 'object' && 'default' in createEvent ? createEvent['default'] : createEvent);

    var innerhtml = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['../../native/create-event'], factory);
      } else if (typeof exports !== "undefined") {
        factory(require$$1$2);
      } else {
        var mod = {
          exports: {}
        };
        factory(global.createEvent);
        global.innerhtml = mod.exports;
      }
    })(__commonjs_global, function (_createEvent) {
      'use strict';

      var _createEvent2 = _interopRequireDefault(_createEvent);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

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
              var mutationEvent = (0, _createEvent2.default)('MutationEvent');
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

    var require$$0$9 = (innerhtml && typeof innerhtml === 'object' && 'default' in innerhtml ? innerhtml['default'] : innerhtml);

    var getClosestIgnoredElement = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './ignored'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$4);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.ignored);
        global.getClosestIgnoredElement = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _ignored) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (element) {
        var parent = element;
        while (parent instanceof Element) {
          if ((0, _ignored2.default)(parent)) {
            return parent;
          }
          parent = parent.parentNode;
        }
      };

      var _ignored2 = _interopRequireDefault(_ignored);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var _window = window;
      var Element = _window.Element;
      module.exports = exports['default'];
    });
    });

    var require$$4$1 = (getClosestIgnoredElement && typeof getClosestIgnoredElement === 'object' && 'default' in getClosestIgnoredElement ? getClosestIgnoredElement['default'] : getClosestIgnoredElement);

    var documentObserver = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/get-closest-ignored-element', './vars', './registry', '../util/walk-tree', '../fix/ie/innerhtml'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$4$1, require$$3, require$$0$8, require$$0$3, require$$0$9);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.getClosestIgnoredElement, global.vars, global.registry, global.walkTree, global.innerhtml);
        global.documentObserver = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _getClosestIgnoredElement, _vars, _registry, _walkTree) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _getClosestIgnoredElement2 = _interopRequireDefault(_getClosestIgnoredElement);

      var _vars2 = _interopRequireDefault(_vars);

      var _registry2 = _interopRequireDefault(_registry);

      var _walkTree2 = _interopRequireDefault(_walkTree);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function triggerAddedNodes(addedNodes) {
        (0, _walkTree2.default)(addedNodes, function (element) {
          var component = _registry2.default.find(element);
          if (component) {
            if (component.prototype.createdCallback) {
              component.prototype.createdCallback.call(element);
            }

            if (component.prototype.attachedCallback) {
              component.prototype.attachedCallback.call(element);
            }
          }
        });
      }

      function triggerRemovedNodes(removedNodes) {
        (0, _walkTree2.default)(removedNodes, function (element) {
          var component = _registry2.default.find(element);
          if (component && component.prototype.detachedCallback) {
            component.prototype.detachedCallback.call(element);
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
          if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement2.default)(addedNodes[0].parentNode)) {
            triggerAddedNodes(addedNodes);
          }

          // We can't check batched nodes here because they won't have a parent node.
          if (removedNodes && removedNodes.length) {
            triggerRemovedNodes(removedNodes);
          }
        }
      }

      function createMutationObserver() {
        var _window = window;
        var MutationObserver = _window.MutationObserver;

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

      exports.default = _vars2.default.registerIfNotExists('observer', {
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
      module.exports = exports['default'];
    });
    });

    var require$$8 = (documentObserver && typeof documentObserver === 'object' && 'default' in documentObserver ? documentObserver['default'] : documentObserver);

    var data = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.data = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (element) {
        var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
        return namespace && (data[namespace] || (data[namespace] = {})) || data;
      };

      module.exports = exports['default'];
    });
    });

    var require$$1$3 = (data && typeof data === 'object' && 'default' in data ? data['default'] : data);

    var detached = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/data'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$1$3);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.data);
        global.detached = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _data) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (opts) {
        var detached = opts.detached;

        return detached ? function () {
          var info = (0, _data2.default)(this);
          if (info.detached) return;
          info.detached = true;
          info.attached = false;
          detached(this);
        } : undefined;
      };

      var _data2 = _interopRequireDefault(_data);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$9 = (detached && typeof detached === 'object' && 'default' in detached ? detached['default'] : detached);

    var defaults = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './type/element'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$6);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.element);
        global.defaults = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _element) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _element2 = _interopRequireDefault(_element);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var nope = null;

      exports.default = {
        attached: nope,
        attribute: nope,
        created: nope,
        render: nope,
        detached: nope,
        events: nope,
        extends: nope,
        properties: nope,
        prototype: {},
        resolvedAttribute: 'resolved',
        ready: nope,
        type: _element2.default,
        unresolvedAttribute: 'unresolved'
      };
      module.exports = exports['default'];
    });
    });

    var require$$10 = (defaults && typeof defaults === 'object' && 'default' in defaults ? defaults['default'] : defaults);

    var resolve = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.resolve = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = resolve;
      function resolve(elem, opts) {
        elem.removeAttribute(opts.unresolvedAttribute);
        elem.setAttribute(opts.resolvedAttribute, '');
      }
      module.exports = exports['default'];
    });
    });

    var require$$0$10 = (resolve && typeof resolve === 'object' && 'default' in resolve ? resolve['default'] : resolve);

    var prototype = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/protos', '../util/define-properties', '../util/get-own-property-descriptors'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$2$1, require$$1$1, require$$0$5);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.protos, global.defineProperties, global.getOwnPropertyDescriptors);
        global.prototype = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _protos, _defineProperties, _getOwnPropertyDescriptors) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = prototype;

      var _protos2 = _interopRequireDefault(_protos);

      var _defineProperties2 = _interopRequireDefault(_defineProperties);

      var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function prototype(opts) {
        var prototypes = (0, _protos2.default)(opts.prototype);
        return function (elem) {
          prototypes.forEach(function (proto) {
            if (!proto.isPrototypeOf(elem)) {
              (0, _defineProperties2.default)(elem, (0, _getOwnPropertyDescriptors2.default)(proto));
            }
          });
        };
      }
      module.exports = exports['default'];
    });
    });

    var require$$1$4 = (prototype && typeof prototype === 'object' && 'default' in prototype ? prototype['default'] : prototype);

    var propertiesReady = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.propertiesReady = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = propertiesApply;
      function propertiesApply(elem, properties) {
        Object.keys(properties).forEach(function (name) {
          properties[name].ready(elem);
        });
      }
      module.exports = exports['default'];
    });
    });

    var require$$2$3 = (propertiesReady && typeof propertiesReady === 'object' && 'default' in propertiesReady ? propertiesReady['default'] : propertiesReady);

    var propertiesCreated = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.propertiesCreated = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = propertiesApply;
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
      module.exports = exports['default'];
    });
    });

    var require$$3$1 = (propertiesCreated && typeof propertiesCreated === 'object' && 'default' in propertiesCreated ? propertiesCreated['default'] : propertiesCreated);

    var empty = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.empty = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (val) {
        return typeof val === 'undefined' || val === null;
      };

      module.exports = exports['default'];
    });
    });

    var require$$0$11 = (empty && typeof empty === 'object' && 'default' in empty ? empty['default'] : empty);

    var dashCase = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.dashCase = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (str) {
        return str.split(/([A-Z])/).reduce(function (one, two, idx) {
          var dash = !one || idx % 2 === 0 ? '' : '-';
          return '' + one + dash + two.toLowerCase();
        });
      };

      module.exports = exports['default'];
    });
    });

    var require$$2$4 = (dashCase && typeof dashCase === 'object' && 'default' in dashCase ? dashCase['default'] : dashCase);

    var index$3 = __commonjs(function (module) {
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

    var assign = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

    var propertiesInit = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'object-assign', '../util/dash-case', '../util/data', '../util/empty'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, assign, require$$2$4, require$$1$3, require$$0$11);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.objectAssign, global.dashCase, global.data, global.empty);
        global.propertiesInit = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _objectAssign, _dashCase, _data, _empty) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (opts) {
        opts = opts || {};

        if (typeof opts === 'function') {
          opts = { coerce: opts };
        }

        return function (name) {
          return createNativePropertyDefinition(name, (0, _objectAssign2.default)({
            deserialize: function deserialize(value) {
              return value;
            },
            serialize: function serialize(value) {
              return value;
            }
          }, opts));
        };
      };

      var _objectAssign2 = _interopRequireDefault(_objectAssign);

      var _dashCase2 = _interopRequireDefault(_dashCase);

      var _data2 = _interopRequireDefault(_data);

      var _empty2 = _interopRequireDefault(_empty);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var _window$Element$proto = window.Element.prototype;
      var removeAttribute = _window$Element$proto.removeAttribute;
      var setAttribute = _window$Element$proto.setAttribute;

      function getData(elem, name) {
        return (0, _data2.default)(elem, 'api/property/' + name);
      }

      function getDataForAttribute(elem, name) {
        return getData(elem, getData(elem, name).linkedProperty);
      }

      function getLinkedAttribute(name, attr) {
        return attr === true ? (0, _dashCase2.default)(name) : attr;
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

          if (typeof opts.default === 'function') {
            info.defaultValue = opts.default(elem, { name: name });
          } else if (!(0, _empty2.default)(opts.default)) {
            info.defaultValue = opts.default;
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

                if ((0, _empty2.default)(serializedValue)) {
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
          if ((0, _empty2.default)(initialValue)) {
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
          elem[name] = (0, _empty2.default)(initial) ? this.initial(elem) : initial;
        };

        prop.set = function (newValue) {
          var info = getData(this, name);
          var oldValue = info.oldValue;

          if (info.updatingProperty) {
            return;
          }

          info.updatingProperty = true;

          if ((0, _empty2.default)(newValue)) {
            newValue = info.defaultValue;
          }

          if (typeof opts.coerce === 'function') {
            newValue = opts.coerce(newValue);
          }

          info.internalValue = newValue;

          if (info.linkedAttribute && !info.updatingAttribute) {
            var serializedValue = opts.serialize(newValue);
            if ((0, _empty2.default)(serializedValue)) {
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

      module.exports = exports['default'];
    });
    });

    var require$$4$2 = (propertiesInit && typeof propertiesInit === 'object' && 'default' in propertiesInit ? propertiesInit['default'] : propertiesInit);

    var patchAttributeMethods = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.patchAttributeMethods = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = patchAttributeMethods;
      function patchAttributeMethods(elem) {
        var removeAttribute = elem.removeAttribute;
        var setAttribute = elem.setAttribute;

        elem.removeAttribute = function (name) {
          var oldValue = this.getAttribute(name);
          removeAttribute.call(elem, name);
          if (elem.attributeChangedCallback) {
            elem.attributeChangedCallback(name, oldValue, null);
          }
        };

        elem.setAttribute = function (name, newValue) {
          var oldValue = this.getAttribute(name);
          setAttribute.call(elem, name, newValue);
          if (elem.attributeChangedCallback) {
            elem.attributeChangedCallback(name, oldValue, String(newValue));
          }
        };
      }
      module.exports = exports['default'];
    });
    });

    var require$$5 = (patchAttributeMethods && typeof patchAttributeMethods === 'object' && 'default' in patchAttributeMethods ? patchAttributeMethods['default'] : patchAttributeMethods);

    var matchesSelector = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../native/create-element'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$2$2);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.createElement);
        global.matchesSelector = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _createElement) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (element, selector) {
        if (hasNativeMatchesSelectorDetattachedBug) {
          var clone = element.cloneNode();
          (0, _createElement2.default)('div').appendChild(clone);
          return nativeMatchesSelector.call(clone, selector);
        }
        return nativeMatchesSelector.call(element, selector);
      };

      var _createElement2 = _interopRequireDefault(_createElement);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var elProto = window.HTMLElement.prototype;
      var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

      // Only IE9 has this msMatchesSelector bug, but best to detect it.
      var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call((0, _createElement2.default)('div'), 'div');

      module.exports = exports['default'];
    });
    });

    var require$$0$12 = (matchesSelector && typeof matchesSelector === 'object' && 'default' in matchesSelector ? matchesSelector['default'] : matchesSelector);

    var events = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/matches-selector'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$12);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.matchesSelector);
        global.events = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _matchesSelector) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = events;

      var _matchesSelector2 = _interopRequireDefault(_matchesSelector);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function readonly(obj, prop, val) {
        Object.defineProperty(obj, prop, {
          configurable: true,
          get: function get() {
            return val;
          }
        });
      }

      function parseEvent(e) {
        var indexOfSpace = e.indexOf(' ');
        var hasSpace = indexOfSpace > 0;
        var name = hasSpace ? e.substring(0, indexOfSpace) : e;
        var selector = hasSpace ? e.substring(indexOfSpace + 1) : '';
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
            if ((0, _matchesSelector2.default)(current, selector)) {
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
        var events = opts.events || {};
        return function (elem) {
          for (var name in events) {
            bindEvent(elem, name, events[name].bind(elem));
          }
        };
      }
      module.exports = exports['default'];
    });
    });

    var require$$6 = (events && typeof events === 'object' && 'default' in events ? events['default'] : events);

    var created = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/data', './events', './patch-attribute-methods', './properties-init', './properties-created', './properties-ready', './prototype', './resolve'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$1$3, require$$6, require$$5, require$$4$2, require$$3$1, require$$2$3, require$$1$4, require$$0$10);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.data, global.events, global.patchAttributeMethods, global.propertiesInit, global.propertiesCreated, global.propertiesReady, global.prototype, global.resolve);
        global.created = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _data, _events, _patchAttributeMethods, _propertiesInit, _propertiesCreated, _propertiesReady, _prototype, _resolve) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (opts) {
        var attribute = opts.attribute;
        var created = opts.created;
        var events = opts.events;
        var isNative = opts.isNative;
        var properties = opts.properties;
        var prototype = opts.prototype;
        var ready = opts.ready;
        var render = opts.render;
        var resolvedAttribute = opts.resolvedAttribute;

        var applyEvents = (0, _events2.default)(opts);
        var applyPrototype = (0, _prototype2.default)(opts);
        var propertyFunctions = ensurePropertyFunctions(opts);

        // Performance critical code!
        return function () {
          var info = (0, _data2.default)(this);
          var resolved = this.hasAttribute(resolvedAttribute);
          var propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
          var readyCallbacks = info.readyCallbacks;

          if (info.created) {
            return;
          }

          info.created = true;

          if (!isNative) {
            if (attribute) {
              (0, _patchAttributeMethods2.default)(this);
            }

            if (prototype) {
              applyPrototype(this);
            }
          }

          if (propertyDefinitions) {
            (0, _propertiesCreated2.default)(this, propertyDefinitions);
          }

          if (events) {
            applyEvents(this);
          }

          if (created) {
            created(this);
          }

          if (render && !resolved) {
            render(this);
          }

          if (propertyDefinitions) {
            (0, _propertiesReady2.default)(this, propertyDefinitions);
          }

          if (ready) {
            ready(this);
          }

          if (readyCallbacks) {
            readyCallbacks.forEach(function (cb) {
              return cb();
            });
            info.readyCallbacks = null;
          }

          if (!resolved) {
            (0, _resolve2.default)(this, opts);
          }
        };
      };

      var _data2 = _interopRequireDefault(_data);

      var _events2 = _interopRequireDefault(_events);

      var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

      var _propertiesInit2 = _interopRequireDefault(_propertiesInit);

      var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);

      var _propertiesReady2 = _interopRequireDefault(_propertiesReady);

      var _prototype2 = _interopRequireDefault(_prototype);

      var _resolve2 = _interopRequireDefault(_resolve);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      // TODO Remove this when we no longer support the legacy definitions and only
      // support a superset of a native property definition.
      function ensurePropertyFunctions(opts) {
        var properties = opts.properties;
        var names = Object.keys(properties || {});
        return names.reduce(function (descriptors, descriptorName) {
          descriptors[descriptorName] = opts.properties[descriptorName];
          if (typeof descriptors[descriptorName] !== 'function') {
            descriptors[descriptorName] = (0, _propertiesInit2.default)(descriptors[descriptorName]);
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

      module.exports = exports['default'];
    });
    });

    var require$$12 = (created && typeof created === 'object' && 'default' in created ? created['default'] : created);

    var attribute = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.attribute = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (opts) {
        var attribute = opts.attribute;

        if (typeof attribute !== 'function') {
          return;
        }

        return function (name, oldValue, newValue) {
          attribute(this, {
            name: name,
            newValue: newValue === null ? undefined : newValue,
            oldValue: oldValue === null ? undefined : oldValue
          });
        };
      };

      module.exports = exports['default'];
    });
    });

    var require$$13 = (attribute && typeof attribute === 'object' && 'default' in attribute ? attribute['default'] : attribute);

    var attached = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/data'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$1$3);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.data);
        global.attached = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _data) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (opts) {
        var attached = opts.attached;

        return attached ? function () {
          var info = (0, _data2.default)(this);
          if (info.attached) return;
          info.attached = true;
          info.detached = false;
          attached(this);
        } : undefined;
      };

      var _data2 = _interopRequireDefault(_data);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$14 = (attached && typeof attached === 'object' && 'default' in attached ? attached['default'] : attached);

    var version = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.version = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = '0.15.3';
      module.exports = exports['default'];
    });
    });

    var require$$16 = (version && typeof version === 'object' && 'default' in version ? version['default'] : version);

    var render$4 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../shared/registry'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$8);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.registry);
        global.render = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _registry) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (elem) {
        var component = _registry2.default.find(elem);
        if (component && component.render) {
          component.render(elem);
        }
      };

      var _registry2 = _interopRequireDefault(_registry);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$17 = (render$4 && typeof render$4 === 'object' && 'default' in render$4 ? render$4['default'] : render$4);

    var ready$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/data', '../shared/registry'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$1$3, require$$0$8);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.data, global.registry);
        global.ready = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _data, _registry) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (elements, callback) {
        var collection = elements.length === undefined ? [elements] : elements;
        var collectionLength = collection.length;
        var readyCount = 0;

        function callbackIfReady() {
          ++readyCount;
          if (readyCount === collectionLength) {
            callback(elements);
          }
        }

        for (var a = 0; a < collectionLength; a++) {
          var elem = collection[a];

          if (ready(elem)) {
            callbackIfReady();
          } else {
            var info = (0, _data2.default)(elem);
            if (info.readyCallbacks) {
              info.readyCallbacks.push(callbackIfReady);
            } else {
              info.readyCallbacks = [callbackIfReady];
            }
          }
        }
      };

      var _data2 = _interopRequireDefault(_data);

      var _registry2 = _interopRequireDefault(_registry);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function ready(element) {
        var component = _registry2.default.find(element);
        return component && (0, _data2.default)(element).created;
      }

      module.exports = exports['default'];
    });
    });

    var require$$18 = (ready$1 && typeof ready$1 === 'object' && 'default' in ready$1 ? ready$1['default'] : ready$1);

    var string = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../../util/empty'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$11);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.empty);
        global.string = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _empty) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _empty2 = _interopRequireDefault(_empty);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
        return (0, _empty2.default)(val) ? undefined : String(val);
      };

      exports.default = {
        coerce: alwaysUndefinedIfEmpty,
        deserialize: alwaysUndefinedIfEmpty,
        serialize: alwaysUndefinedIfEmpty
      };
      module.exports = exports['default'];
    });
    });

    var require$$0$13 = (string && typeof string === 'object' && 'default' in string ? string['default'] : string);

    var number = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../../util/empty'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$11);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.empty);
        global.number = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _empty) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _empty2 = _interopRequireDefault(_empty);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
        return (0, _empty2.default)(val) ? undefined : Number(val);
      };

      exports.default = {
        coerce: alwaysUndefinedIfEmpty,
        deserialize: alwaysUndefinedIfEmpty,
        serialize: alwaysUndefinedIfEmpty
      };
      module.exports = exports['default'];
    });
    });

    var require$$1$5 = (number && typeof number === 'object' && 'default' in number ? number['default'] : number);

    var boolean = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.boolean = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = {
        coerce: function coerce(value) {
          return !!value;
        },
        default: false,
        deserialize: function deserialize(value) {
          return !(value === null);
        },
        serialize: function serialize(value) {
          return value ? '' : undefined;
        }
      };
      module.exports = exports['default'];
    });
    });

    var require$$2$5 = (boolean && typeof boolean === 'object' && 'default' in boolean ? boolean['default'] : boolean);

    var index$4 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'object-assign', './boolean', './number', './string'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, assign, require$$2$5, require$$1$5, require$$0$13);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.objectAssign, global.boolean, global.number, global.string);
        global.index = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _objectAssign, _boolean, _number, _string) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _objectAssign2 = _interopRequireDefault(_objectAssign);

      var _boolean2 = _interopRequireDefault(_boolean);

      var _number2 = _interopRequireDefault(_number);

      var _string2 = _interopRequireDefault(_string);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function prop(def) {
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          args.unshift({}, def);
          return _objectAssign2.default.apply(null, args);
        };
      }

      exports.default = {
        boolean: prop(_boolean2.default),
        number: prop(_number2.default),
        string: prop(_string2.default)
      };
      module.exports = exports['default'];
    });
    });

    var require$$19 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

    var elementContains = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.elementContains = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (source, target) {
        // The document element does not have the contains method in IE.
        if (source === document && !source.contains) {
          return head.contains(target) || body.contains(target);
        }
        return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
      };

      var _document = document;
      var body = _document.body;
      var head = _document.head;

      var elementPrototype = window.HTMLElement.prototype;
      var elementPrototypeContains = elementPrototype.contains;

      module.exports = exports['default'];
    });
    });

    var require$$0$14 = (elementContains && typeof elementContains === 'object' && 'default' in elementContains ? elementContains['default'] : elementContains);

    var init$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../util/element-contains', '../shared/registry', '../util/walk-tree'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$0$14, require$$0$8, require$$0$3);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.elementContains, global.registry, global.walkTree);
        global.init = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _elementContains, _registry, _walkTree) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.forEach(function (arg) {
          var isInDom = (0, _elementContains2.default)(document, arg);
          (0, _walkTree2.default)(arg, function (descendant) {
            var component = _registry2.default.find(descendant);
            if (component && !component.isNative) {
              if (component.prototype.createdCallback) {
                component.prototype.createdCallback.call(descendant);
              }

              if (isInDom && component.prototype.attachedCallback) {
                isInDom && component.prototype.attachedCallback.call(descendant);
              }
            }
          });
        });
      };

      var _elementContains2 = _interopRequireDefault(_elementContains);

      var _registry2 = _interopRequireDefault(_registry);

      var _walkTree2 = _interopRequireDefault(_walkTree);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$1$6 = (init$1 && typeof init$1 === 'object' && 'default' in init$1 ? init$1['default'] : init$1);

    var createDocumentFragment = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(["module", "exports"], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports);
        global.createDocumentFragment = mod.exports;
      }
    })(__commonjs_global, function (module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = Document.prototype.createDocumentFragment.bind(document);
      module.exports = exports['default'];
    });
    });

    var require$$2$6 = (createDocumentFragment && typeof createDocumentFragment === 'object' && 'default' in createDocumentFragment ? createDocumentFragment['default'] : createDocumentFragment);

    var fragment$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../native/create-document-fragment', '../native/create-element', './init'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$2$6, require$$2$2, require$$1$6);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.createDocumentFragment, global.createElement, global.init);
        global.fragment = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _createDocumentFragment, _createElement, _init) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = fragment;

      var _createDocumentFragment2 = _interopRequireDefault(_createDocumentFragment);

      var _createElement2 = _interopRequireDefault(_createElement);

      var _init2 = _interopRequireDefault(_init);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var _window = window;
      var Node = _window.Node;
      var NodeList = _window.NodeList;

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
        var container = (0, _createElement2.default)('div');
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
            (0, _init2.default)(node);
          }

          if (node) {
            frag.appendChild(node);
          }

          return frag;
        }, (0, _createDocumentFragment2.default)());
      }
      module.exports = exports['default'];
    });
    });

    var require$$21 = (fragment$1 && typeof fragment$1 === 'object' && 'default' in fragment$1 ? fragment$1['default'] : fragment$1);

    var emit$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', '../native/create-element', '../native/create-event', '../util/element-contains'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$2$2, require$$1$2, require$$0$14);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.createElement, global.createEvent, global.elementContains);
        global.emit = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _createElement, _createEvent, _elementContains) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (elem, name) {
        var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var names = typeof name === 'string' ? name.split(' ') : name;
        return names.reduce(function (prev, curr) {
          if (emitOne(elem, curr, opts) === false) {
            prev.push(curr);
          }
          return prev;
        }, []);
      };

      var _createElement2 = _interopRequireDefault(_createElement);

      var _createEvent2 = _interopRequireDefault(_createEvent);

      var _elementContains2 = _interopRequireDefault(_elementContains);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

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
        var parent = (0, _createElement2.default)('div');
        var child = (0, _createElement2.default)('div');
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

        var e = (0, _createEvent2.default)('CustomEvent');
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
        shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _elementContains2.default)(document, elem);

        return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
      }

      module.exports = exports['default'];
    });
    });

    var require$$22 = (emit$1 && typeof emit$1 === 'object' && 'default' in emit$1 ? emit$1['default'] : emit$1);

    var create$1 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'object-assign', '../native/create-element', './init', '../shared/registry'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, assign, require$$2$2, require$$1$6, require$$0$8);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.objectAssign, global.createElement, global.init, global.registry);
        global.create = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _objectAssign, _createElement, _init, _registry) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (name, props) {
        var Ctor = _registry2.default.get(name);
        var elem = Ctor ? Ctor.type.create(Ctor) : (0, _createElement2.default)(name);
        Ctor && (0, _init2.default)(elem);
        return (0, _objectAssign2.default)(elem, props);
      };

      var _objectAssign2 = _interopRequireDefault(_objectAssign);

      var _createElement2 = _interopRequireDefault(_createElement);

      var _init2 = _interopRequireDefault(_init);

      var _registry2 = _interopRequireDefault(_registry);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      module.exports = exports['default'];
    });
    });

    var require$$23 = (create$1 && typeof create$1 === 'object' && 'default' in create$1 ? create$1['default'] : create$1);

    var index$2 = __commonjs(function (module, exports, global) {
    (function (global, factory) {
      if (typeof define === "function" && define.amd) {
        define(['module', 'exports', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './native/create-element', './defaults', './lifecycle/detached', './shared/document-observer', './native/register-element', './shared/registry', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree'], factory);
      } else if (typeof exports !== "undefined") {
        factory(module, exports, require$$23, require$$22, require$$21, require$$1$6, require$$19, require$$18, require$$17, require$$16, assign, require$$14, require$$13, require$$12, require$$2$2, require$$10, require$$9, require$$8, require$$0$7, require$$0$8, require$$0$6, require$$4, require$$0$5, require$$2, require$$1$1, require$$0$3);
      } else {
        var mod = {
          exports: {}
        };
        factory(mod, mod.exports, global.create, global.emit, global.fragment, global.init, global.index, global.ready, global.render, global.version, global.objectAssign, global.attached, global.attribute, global.created, global.createElement, global.defaults, global.detached, global.documentObserver, global.registerElement, global.registry, global.element, global.getAllPropertyDescriptors, global.getOwnPropertyDescriptors, global.debounce, global.defineProperties, global.walkTree);
        global.index = mod.exports;
      }
    })(__commonjs_global, function (module, exports, _create, _emit, _fragment, _init, _index, _ready, _render, _version, _objectAssign, _attached, _attribute, _created, _createElement, _defaults, _detached, _documentObserver, _registerElement, _registry, _element, _getAllPropertyDescriptors, _getOwnPropertyDescriptors, _debounce, _defineProperties, _walkTree) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _create2 = _interopRequireDefault(_create);

      var _emit2 = _interopRequireDefault(_emit);

      var _fragment2 = _interopRequireDefault(_fragment);

      var _init2 = _interopRequireDefault(_init);

      var _index2 = _interopRequireDefault(_index);

      var _ready2 = _interopRequireDefault(_ready);

      var _render2 = _interopRequireDefault(_render);

      var _version2 = _interopRequireDefault(_version);

      var _objectAssign2 = _interopRequireDefault(_objectAssign);

      var _attached2 = _interopRequireDefault(_attached);

      var _attribute2 = _interopRequireDefault(_attribute);

      var _created2 = _interopRequireDefault(_created);

      var _createElement2 = _interopRequireDefault(_createElement);

      var _defaults2 = _interopRequireDefault(_defaults);

      var _detached2 = _interopRequireDefault(_detached);

      var _documentObserver2 = _interopRequireDefault(_documentObserver);

      var _registerElement2 = _interopRequireDefault(_registerElement);

      var _registry2 = _interopRequireDefault(_registry);

      var _element2 = _interopRequireDefault(_element);

      var _getAllPropertyDescriptors2 = _interopRequireDefault(_getAllPropertyDescriptors);

      var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

      var _debounce2 = _interopRequireDefault(_debounce);

      var _defineProperties2 = _interopRequireDefault(_defineProperties);

      var _walkTree2 = _interopRequireDefault(_walkTree);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var HTMLElement = window.HTMLElement;

      // A function that initialises the document once in a given event loop.
      var initDocument = (0, _debounce2.default)(function () {
        (0, _walkTree2.default)(document.documentElement.childNodes, function (element) {
          var component = _registry2.default.find(element);
          if (component) {
            if (component.prototype.createdCallback) {
              component.prototype.createdCallback.call(element);
            }

            if (component.prototype.attachedCallback) {
              component.prototype.attachedCallback.call(element);
            }
          }
        });
      });

      // Creates a configurable, non-writable, non-enumerable property.
      function fixedProp(obj, name, value) {
        Object.defineProperty(obj, name, {
          configurable: true,
          enumerable: false,
          value: value,
          writable: false
        });
      }

      // Makes a function / constructor that can be called as either.
      function makeCtor(name, opts) {
        var func = _create2.default.bind(null, name);

        // Assigning defaults gives a predictable definition and prevents us from
        // having to do defaults checks everywhere.
        (0, _objectAssign2.default)(func, _defaults2.default);

        // Inherit all options. This takes into account object literals as well as
        // ES2015 classes that may have inherited static props which would not be
        // considered "own".
        (0, _defineProperties2.default)(func, (0, _getAllPropertyDescriptors2.default)(opts));

        // Fixed info.
        fixedProp(func.prototype, 'constructor', func);
        fixedProp(func, 'id', name);
        fixedProp(func, 'isNative', func.type === _element2.default && _registerElement2.default);

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

        // If the options don't inherit a native element prototype, we ensure it does
        // because native requires you explicitly do this. Here we solve the common
        // use case by defaulting to HTMLElement.prototype.
        if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
          var proto = (Ctor.extends ? (0, _createElement2.default)(Ctor.extends).constructor : HTMLElement).prototype;
          Ctor.prototype = Object.create(proto, (0, _getOwnPropertyDescriptors2.default)(Ctor.prototype));
        }

        // We not assign native callbacks to handle the callbacks specified in the
        // Skate definition. This allows us to abstract away any changes that may
        // occur in the spec.
        Ctor.prototype.createdCallback = (0, _created2.default)(Ctor);
        Ctor.prototype.attachedCallback = (0, _attached2.default)(Ctor);
        Ctor.prototype.detachedCallback = (0, _detached2.default)(Ctor);
        Ctor.prototype.attributeChangedCallback = (0, _attribute2.default)(Ctor);

        // In polyfill land we must emulate what the browser would normally do in
        // native.
        if (!Ctor.isNative) {
          initDocument();
          _documentObserver2.default.register();
        }

        // Call register hook. We could put this in the registry, but since the
        // registry is shared across versions, we try and churn that as little as
        // possible. It's fine here for now.
        var type = Ctor.type;
        if (type.register) {
          type.register(Ctor);
        }

        // We keep our own registry since we can't access the native one.
        return _registry2.default.set(name, Ctor);
      }

      // Public API.
      skate.create = _create2.default;
      skate.emit = _emit2.default;
      skate.fragment = _fragment2.default;
      skate.init = _init2.default;
      skate.properties = _index2.default;
      skate.ready = _ready2.default;
      skate.render = _render2.default;
      skate.version = _version2.default;

      exports.default = skate;
      module.exports = exports['default'];
    });
    });

    var skate = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

    var $debounce = Symbol();

    // Defaults all properties to be linked to an attribute unless explicitly
    // specified.
    function createAttributeLinks(elem, opts) {
      var props = opts.properties;
      var tname = elem.toUpperCase();
      Object.keys(props).forEach(function (name) {
        var dataName = tname + '.' + name;
        var prop = props[name];

        // Ensure virtual-DOM knows to set this as a property.
        internalData.applyProp[dataName] = true;

        if (!prop) {
          prop = props[name] = {};
        }

        if (typeof prop.attribute === 'undefined') {
          prop.attribute = true;
        }
      });
    }

    // Creates properties that add / remove event listeners. This is mostly for
    // seemless integration with React.
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

    // Normalises options to safe defaults.
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

    // Creates a safe default for the render option for properties.
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

    // Re-renders the component when a property is set, debouncing it so that it is
    // only rendered once on the tail end of consecutive subsequent property sets.
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
            !deb && (deb = elem[$debounce] = debounce(skate.render, 1));
            deb(elem);
          }
        };
      });
    }

    // Wraps the provided render function with our custom renderer that does all
    // the diffing / patching.
    function wrapRender(opts) {
      opts.render = render$1(opts);
    }

    // Proxies skate() ensuring everything is set up before the component is
    // registered and returned.
    function kickflip (name, opts) {
      ensureOpts(opts);
      createAttributeLinks(name, opts);
      setStateOnPropertySet(opts);
      createEventProperties(opts);
      wrapRender(opts);
      return skate(name, opts);
    }

    function get(elem) {
      var props = elem.constructor.properties;
      var state = {};
      for (var key in props) {
        var val = elem[key];
        if (typeof val !== 'undefined') {
          state[key] = val;
        }
      }
      return state;
    }

    function state (elem, newState) {
      return typeof newState === 'undefined' ? get(elem) : assign(elem, newState);
    }

    function getValue(elem) {
      var type = elem.type;
      if (type === 'checkbox' || type === 'radio') {
        return elem.checked ? elem.value || true : false;
      }
      return elem.value;
    }

    function link (elem, target) {
      return function (e) {
        var value = getValue(e.target);
        var localTarget = target || e.target.name || 'value';

        if (localTarget.indexOf('.') > -1) {
          var parts = localTarget.split('.');
          var firstPart = parts[0];
          var propName = parts.pop();
          var obj = parts.reduce(function (prev, curr) {
            return prev && prev[curr];
          }, elem);

          obj[propName || e.target.name] = value;
          state(elem, babelHelpers.defineProperty({}, firstPart, elem[firstPart]));
        } else {
          state(elem, babelHelpers.defineProperty({}, localTarget, value));
        }
      };
    }

    var props = skate.properties;
    var array = props.array;
    var boolean$1 = props.boolean;
    var number$1 = props.number;
    var string$1 = props.string;



    var properties = Object.freeze({
    	default: props,
    	array: array,
    	boolean: boolean$1,
    	number: number$1,
    	string: string$1
    });

    // Could import these, but we have to import all of IncrementalDOM anyways so
    // so that we can export our configured IncrementalDOM.
    var applyProp$1 = applyProp;
    var attr$1 = attr;
    var attributes$1 = attributes;
    var elementClose$1 = elementClose;
    var elementOpen$1 = elementOpen;
    var elementOpenEnd$1 = elementOpenEnd;
    var elementOpenStart$1 = elementOpenStart;
    var skip$1 = skip;
    var symbols$1 = symbols;
    var text$1 = text;

    // Specify an environment for iDOM in case we haven't yet.

    if (typeof process === 'undefined') {
      /* eslint no-undef: 0 */
      process = { env: { NODE_ENV: 'production' } };
    }

    var applyDefault = attributes$1[symbols$1.default];
    var factories = {};

    // Attributes that are not handled by Incremental DOM.
    attributes$1.key = attributes$1.skip = attributes$1.statics = function () {};

    // Attributes that *must* be set via a property on all elements.
    attributes$1.checked = attributes$1.className = attributes$1.disabled = attributes$1.value = applyProp$1;

    // Default attribute applicator.
    attributes$1[symbols$1.default] = function (element, name, value) {
      var dataName = element.tagName + '.' + name;
      if (internalData.applyProp[dataName]) {
        applyProp$1(element, name, value);
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
        if (attrs && (typeof attrs === 'undefined' ? 'undefined' : babelHelpers.typeof(attrs)) === 'object') {
          elementOpenStart$1(tname, attrs.key, attrs.statics);
          for (var _a in attrs) {
            var val = attrs[_a];
            // Event binding using on* names.
            if (!attributes$1[_a] && _a.indexOf('on') === 0) {
              attributes$1[_a] = applyEvent(_a.substring(2));
              // Class attribute handling.
            } else if (_a === 'class') {
                _a = 'className';
                // False is not set at all.
              } else if (val === false) {
                  continue;
                }
            attr$1(_a, val);
          }
          elementOpenEnd$1();
        } else {
          elementOpen$1(tname);
          chren = attrs;
          attrs = {};
        }

        if (attrs.skip) {
          skip$1();
        } else {
          var chrenType = typeof chren === 'undefined' ? 'undefined' : babelHelpers.typeof(chren);
          if (chrenType === 'function') {
            chren();
          } else if (chrenType === 'string' || chrenType === 'number') {
            text$1(chren);
          }
        }

        return elementClose$1(tname);
      };
    }

    // The default function requries a tag name.
    function create$2(tname, attrs, chren) {
      return (factories[tname] || bind(tname))(attrs, chren);
    }

    // Creates an element that acts as a slot.
    function slot(attrs, chren) {
      // Attributes must be an object so that we can add slot info.
      if (!attrs || (typeof attrs === 'undefined' ? 'undefined' : babelHelpers.typeof(attrs)) !== 'object') {
        chren = attrs;
        attrs = {};
      }

      // Default to a <slot /> element.
      var tname = attrs.type || 'slot';

      // Always add a slot-name attribute, even if it's empty so that the named-
      // slot API can pick it up. We must also prepend a shadowId if there is one
      // so that the named-slot API only finds slot elements that belong to its
      // shadow root, not descendant component shadow roots.
      attrs['slot-name'] = internalData.shadowId + (attrs.name || '');

      // Since this is a slot we *must* skip it so that Incremental DOM doesn't
      // diff / patch the content of it.
      attrs.skip = true;

      // Ensure special attributes aren't passed on.
      delete attrs.name;
      delete attrs.type;

      return create$2(tname, attrs, chren);
    }

    // Create factories for all HTML elements except for ones that match keywords
    // such as "var".
    var a = bind('a');
    var abbr = bind('abbr');
    var address = bind('address');
    var area = bind('area');
    var article = bind('article');
    var aside = bind('aside');
    var audio = bind('audio');
    var b = bind('b');
    var base = bind('base');
    var bdi = bind('bdi');
    var bdo = bind('bdo');
    var bgsound = bind('bgsound');
    var blockquote = bind('blockquote');
    var body = bind('body');
    var br = bind('br');
    var button = bind('button');
    var canvas = bind('canvas');
    var caption = bind('caption');
    var cite = bind('cite');
    var code = bind('code');
    var col = bind('col');
    var colgroup = bind('colgroup');
    var command = bind('command');
    var content = bind('content');
    var data$1 = bind('data');
    var datalist = bind('datalist');
    var dd = bind('dd');
    var del = bind('del');
    var details = bind('details');
    var dfn = bind('dfn');
    var dialog = bind('dialog');
    var div = bind('div');
    var dl = bind('dl');
    var dt = bind('dt');
    var element$1 = bind('element');
    var em = bind('em');
    var embed = bind('embed');
    var fieldset = bind('fieldset');
    var figcaption = bind('figcaption');
    var figure = bind('figure');
    var font = bind('font');
    var footer = bind('footer');
    var form = bind('form');
    var h1 = bind('h1');
    var h2 = bind('h2');
    var h3 = bind('h3');
    var h4 = bind('h4');
    var h5 = bind('h5');
    var h6 = bind('h6');
    var head = bind('head');
    var header = bind('header');
    var hgroup = bind('hgroup');
    var hr = bind('hr');
    var html = bind('html');
    var i = bind('i');
    var iframe = bind('iframe');
    var image = bind('image');
    var img = bind('img');
    var input = bind('input');
    var ins = bind('ins');
    var kbd = bind('kbd');
    var keygen = bind('keygen');
    var label = bind('label');
    var legend = bind('legend');
    var li = bind('li');
    var link$1 = bind('link');
    var main = bind('main');
    var map = bind('map');
    var mark = bind('mark');
    var marquee = bind('marquee');
    var menu = bind('menu');
    var menuitem = bind('menuitem');
    var meta = bind('meta');
    var meter = bind('meter');
    var multicol = bind('multicol');
    var nav = bind('nav');
    var nobr = bind('nobr');
    var noembed = bind('noembed');
    var noframes = bind('noframes');
    var noscript = bind('noscript');
    var object = bind('object');
    var ol = bind('ol');
    var optgroup = bind('optgroup');
    var option = bind('option');
    var output = bind('output');
    var p = bind('p');
    var param = bind('param');
    var picture = bind('picture');
    var pre = bind('pre');
    var progress = bind('progress');
    var q = bind('q');
    var rp = bind('rp');
    var rt = bind('rt');
    var rtc = bind('rtc');
    var ruby = bind('ruby');
    var s = bind('s');
    var samp = bind('samp');
    var script = bind('script');
    var section = bind('section');
    var select = bind('select');
    var shadow = bind('shadow');
    var small = bind('small');
    var source = bind('source');
    var span = bind('span');
    var strong = bind('strong');
    var style = bind('style');
    var sub = bind('sub');
    var summary = bind('summary');
    var sup = bind('sup');
    var table = bind('table');
    var tbody = bind('tbody');
    var td = bind('td');
    var template = bind('template');
    var textarea = bind('textarea');
    var tfoot = bind('tfoot');
    var th = bind('th');
    var thead = bind('thead');
    var time = bind('time');
    var title = bind('title');
    var tr = bind('tr');
    var track = bind('track');
    var u = bind('u');
    var ul = bind('ul');
    var video = bind('video');
    var wbr = bind('wbr');

var vdom = Object.freeze({
      default: create$2,
      text: text$1,
      slot: slot,
      a: a,
      abbr: abbr,
      address: address,
      area: area,
      article: article,
      aside: aside,
      audio: audio,
      b: b,
      base: base,
      bdi: bdi,
      bdo: bdo,
      bgsound: bgsound,
      blockquote: blockquote,
      body: body,
      br: br,
      button: button,
      canvas: canvas,
      caption: caption,
      cite: cite,
      code: code,
      col: col,
      colgroup: colgroup,
      command: command,
      content: content,
      data: data$1,
      datalist: datalist,
      dd: dd,
      del: del,
      details: details,
      dfn: dfn,
      dialog: dialog,
      div: div,
      dl: dl,
      dt: dt,
      element: element$1,
      em: em,
      embed: embed,
      fieldset: fieldset,
      figcaption: figcaption,
      figure: figure,
      font: font,
      footer: footer,
      form: form,
      h1: h1,
      h2: h2,
      h3: h3,
      h4: h4,
      h5: h5,
      h6: h6,
      head: head,
      header: header,
      hgroup: hgroup,
      hr: hr,
      html: html,
      i: i,
      iframe: iframe,
      image: image,
      img: img,
      input: input,
      ins: ins,
      kbd: kbd,
      keygen: keygen,
      label: label,
      legend: legend,
      li: li,
      link: link$1,
      main: main,
      map: map,
      mark: mark,
      marquee: marquee,
      menu: menu,
      menuitem: menuitem,
      meta: meta,
      meter: meter,
      multicol: multicol,
      nav: nav,
      nobr: nobr,
      noembed: noembed,
      noframes: noframes,
      noscript: noscript,
      object: object,
      ol: ol,
      optgroup: optgroup,
      option: option,
      output: output,
      p: p,
      param: param,
      picture: picture,
      pre: pre,
      progress: progress,
      q: q,
      rp: rp,
      rt: rt,
      rtc: rtc,
      ruby: ruby,
      s: s,
      samp: samp,
      script: script,
      section: section,
      select: select,
      shadow: shadow,
      small: small,
      source: source,
      span: span,
      strong: strong,
      style: style,
      sub: sub,
      summary: summary,
      sup: sup,
      table: table,
      tbody: tbody,
      td: td,
      template: template,
      textarea: textarea,
      tfoot: tfoot,
      th: th,
      thead: thead,
      time: time,
      title: title,
      tr: tr,
      track: track,
      u: u,
      ul: ul,
      video: video,
      wbr: wbr
    });

    var version$1 = '0.0.7';

    var create = skate.create;
    var emit = skate.emit;
    var fragment = skate.fragment;
    var init = skate.init;
    var ready = skate.ready;
    var render = skate.render;




    var api = Object.freeze({
    	default: kickflip,
    	create: create,
    	emit: emit,
    	fragment: fragment,
    	init: init,
    	link: link,
    	properties: properties,
    	ready: ready,
    	render: render,
    	state: state,
    	vdom: vdom,
    	version: version$1
    });

    var previousGlobal = window.kickflip;
    kickflip.noConflict = function noConflict() {
      window.kickflip = previousGlobal;
      return this;
    };
    window.kickflip = kickflip;
    for (var name in api) {
      kickflip[name] = api[name];
    }

    return kickflip;

}));
//# sourceMappingURL=index.js.map