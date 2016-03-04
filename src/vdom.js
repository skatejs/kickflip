import {
  applyProp,
  attr,
  attributes,
  elementClose,
  elementOpen,
  elementOpenEnd,
  elementOpenStart,
  skip,
  text
} from 'incremental-dom';
import internalData from './data';

// Specify an environment for iDOM in case we haven't yet.
if (typeof process === 'undefined') {
  process = { env: { NODE_ENV: 'production' } };
}

const factories = {};

// Attributes that are not handled by Incremental DOM.
attributes.key = attributes.skip = attributes.statics = function () {};

// Attributes that *must* be set via a property.
attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

function applyEvent (eName) {
  return function (elem, name, value) {
    let events = elem.__events;

    if (!events) {
      events = elem.__events = {};
    }

    const eFunc = events[eName];

    if (eFunc) {
      elem.removeEventListener(eName, eFunc);
    }

    events[eName] = value;
    elem.addEventListener(eName, value);
  };
}

// Creates a factory and returns it.
function bind (tname) {
  if (typeof tname === 'function') {
    tname = tname.id || tname.name;
  }

  return factories[tname] = function (attrs, chren) {
    if (attrs && typeof attrs === 'object') {
      elementOpenStart(tname, attrs.key, attrs.statics);
      for (let a in attrs) {
        let val = attrs[a];
        // Event binding using on* names.
        if (!attributes[a] && a.indexOf('on') === 0) {
          attributes[a] = applyEvent(a.substring(2));
        // Class attribute handling.
        } else if (a === 'class') {
          a = 'className';
        // True becomes an empty string (boolean attributes).
        } else if (val === true) {
          val = '';
        // False is not set at all (boolean attributes).
        } else if (val === false) {
          continue;
        }
        attr(a, val);
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
      const chrenType = typeof chren;
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
export default function create (tname, attrs, chren) {
  return (factories[tname] || bind(tname))(attrs, chren);
}

// Export the Incremental DOM text() function directly as we don't need to do
// any special processing for it.
export { text };

// Creates an element that acts as a slot.
export function slot (attrs, chren) {
  // Attributes must be an object so that we can add slot info.
  if (attrs && typeof attrs !== 'object') {
    chren = attrs;
    attrs = {};
  }

  // Default to a <slot /> element.
  const tname = attrs.type || 'slot';

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

  return create(tname, attrs, chren);
}

// Create factories for all HTML elements except for ones that match keywords
// such as "var".
export const a = bind('a');
export const abbr = bind('abbr');
export const address = bind('address');
export const area = bind('area');
export const article = bind('article');
export const aside = bind('aside');
export const audio = bind('audio');
export const b = bind('b');
export const base = bind('base');
export const bdi = bind('bdi');
export const bdo = bind('bdo');
export const bgsound = bind('bgsound');
export const blockquote = bind('blockquote');
export const body = bind('body');
export const br = bind('br');
export const button = bind('button');
export const canvas = bind('canvas');
export const caption = bind('caption');
export const cite = bind('cite');
export const code = bind('code');
export const col = bind('col');
export const colgroup = bind('colgroup');
export const command = bind('command');
export const content = bind('content');
export const data = bind('data');
export const datalist = bind('datalist');
export const dd = bind('dd');
export const del = bind('del');
export const details = bind('details');
export const dfn = bind('dfn');
export const dialog = bind('dialog');
export const div = bind('div');
export const dl = bind('dl');
export const dt = bind('dt');
export const element = bind('element');
export const em = bind('em');
export const embed = bind('embed');
export const fieldset = bind('fieldset');
export const figcaption = bind('figcaption');
export const figure = bind('figure');
export const font = bind('font');
export const footer = bind('footer');
export const form = bind('form');
export const h1 = bind('h1');
export const h2 = bind('h2');
export const h3 = bind('h3');
export const h4 = bind('h4');
export const h5 = bind('h5');
export const h6 = bind('h6');
export const head = bind('head');
export const header = bind('header');
export const hgroup = bind('hgroup');
export const hr = bind('hr');
export const html = bind('html');
export const i = bind('i');
export const iframe = bind('iframe');
export const image = bind('image');
export const img = bind('img');
export const input = bind('input');
export const ins = bind('ins');
export const kbd = bind('kbd');
export const keygen = bind('keygen');
export const label = bind('label');
export const legend = bind('legend');
export const li = bind('li');
export const link = bind('link');
export const main = bind('main');
export const map = bind('map');
export const mark = bind('mark');
export const marquee = bind('marquee');
export const menu = bind('menu');
export const menuitem = bind('menuitem');
export const meta = bind('meta');
export const meter = bind('meter');
export const multicol = bind('multicol');
export const nav = bind('nav');
export const nobr = bind('nobr');
export const noembed = bind('noembed');
export const noframes = bind('noframes');
export const noscript = bind('noscript');
export const object = bind('object');
export const ol = bind('ol');
export const optgroup = bind('optgroup');
export const option = bind('option');
export const output = bind('output');
export const p = bind('p');
export const param = bind('param');
export const picture = bind('picture');
export const pre = bind('pre');
export const progress = bind('progress');
export const q = bind('q');
export const rp = bind('rp');
export const rt = bind('rt');
export const rtc = bind('rtc');
export const ruby = bind('ruby');
export const s = bind('s');
export const samp = bind('samp');
export const script = bind('script');
export const section = bind('section');
export const select = bind('select');
export const shadow = bind('shadow');
export const small = bind('small');
export const source = bind('source');
export const span = bind('span');
export const strong = bind('strong');
export const style = bind('style');
export const sub = bind('sub');
export const summary = bind('summary');
export const sup = bind('sup');
export const table = bind('table');
export const tbody = bind('tbody');
export const td = bind('td');
export const template = bind('template');
export const textarea = bind('textarea');
export const tfoot = bind('tfoot');
export const th = bind('th');
export const thead = bind('thead');
export const time = bind('time');
export const title = bind('title');
export const tr = bind('tr');
export const track = bind('track');
export const u = bind('u');
export const ul = bind('ul');
export const video = bind('video');
export const wbr = bind('wbr');
