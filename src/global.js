import kickflip from './index';

var previousGlobal = window.kickflip;
function noConflict () {
  window.kickflip = previousGlobal;
  return this;
}

kickflip.noConflict = noConflict;
window.kickflip = kickflip;

export default kickflip;