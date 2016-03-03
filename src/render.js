import { patch } from 'incremental-dom';
import data from './data';
import render from 'skatejs-named-slots/lib/render';

let shadowIdCount = 0;
export default function (opts) {
  const internalRenderer = opts.render;

  if (!internalRenderer) {
    return;
  }

  // Keep the internal shadow ID static as this is used to locate the slots
  // that belong to the shadow root excluding any that may belong to descendant
  // components of the shadow root.
  const internalShadowId = ++shadowIdCount;

  return render(function (elem, shadowRoot) {
    // Record the current shadow ID so we can restore it.
    const shadowId = data.shadowId;

    // Set the new shadow ID so that the vDOM API can use it.
    data.shadowId = internalShadowId;

    // Patch once the shadow ID is set.
    patch(shadowRoot, internalRenderer, elem);

    // Restore to the previous ID so that any subsequent elements refer to the
    // proper scope.
    data.shadowId = shadowId;
  }, {
    shadowId: internalShadowId
  });
}
