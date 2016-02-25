import kickflip from './kickflip';
import link from './link';
import skate from '../node_modules/skatejs/lib/index';
import state from './state';
import * as vdom from './vdom';
import version from './version';

const { create, emit, fragment, init, properties, ready, render } = skate;

export default kickflip;
export {
  create,
  emit,
  fragment,
  init,
  link,
  properties,
  ready,
  render,
  state,
  vdom,
  version
};
