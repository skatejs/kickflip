import assign from 'object-assign';
import kickflip from './api/kickflip';
import render from './api/render';
import state from './api/state';

export default assign(kickflip, { render, state });