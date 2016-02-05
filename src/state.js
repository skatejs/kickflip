import assign from 'object-assign';

function get (elem) {
  return Object.keys(elem.constructor.properties || {}).reduce(function (prev, curr) {
    prev[curr] = elem[curr];
    return prev;
  }, {});
}

export default function (elem, newState) {
  return typeof newState === 'undefined' ? get(elem) : assign(elem, newState);
}
