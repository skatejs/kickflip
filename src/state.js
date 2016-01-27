import assign from 'object-assign';
import render from 'skatejs/lib/api/render';

function getState (elem) {
  return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
    prev[curr] = elem[curr];
  }, {});
}

function setState(elem, newState) {
  const ctor = elem.constructor;
  const shouldUpdate = !ctor.update || ctor.update(elem) !== false;
  assign(elem, newState);
  if (shouldUpdate) {
    render(elem);
  }
}

export default function (elem, newState) {
  return typeof newState === 'undefined' ? getState(elem) : setState(elem, newState);
}
