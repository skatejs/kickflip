export default function (elem, prop = 'value') {
  return function (e) {
    elem[prop] = e.currentTarget.value;
  };
}
