import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';

const mapOldTree = new WeakMap();
const mapRootNode = new WeakMap();

export default function (render) {
  return function (elem) {
    const newTree = render(elem, h);
    const oldTree = mapOldTree.get(elem);

    // Keep track of the previous state.
    mapOldTree.set(elem, newTree);

    // If the old tree exists, we're diffing / patching.
    // Otherwise we're doing the initial mount.
    if (oldTree) {
      patch(mapRootNode.get(elem), diff(oldTree, newTree));
    } else {
      const newRootNode = createElement(newTree);
      mapRootNode.set(elem, newRootNode);
      elem.appendChild(newRootNode);
    }
  };
}