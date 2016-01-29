import kickflip from './kickflip';
import skate from 'skatejs';
import state from './state';
import vdom from './vdom';
import version from './version';

kickflip.emit = skate.emit;
kickflip.state = state;
kickflip.vdom = vdom;
kickflip.version = version;

export default kickflip;
