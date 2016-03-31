const raf = requestAnimationFrame || setTimeout;
const caf = cancelAnimationFrame || clearTimeout;

export default function (func) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const callNow = !timeout;

    caf(timeout);
    timeout = raf(function() {
      timeout = null;
      func.apply(context, args);
    });

    if (callNow) {
      func.apply(context, args);
    }
  };
}
