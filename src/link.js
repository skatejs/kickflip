function getInputValue (input) {
  if (input.type === 'checkbox') {
    return input.checked ? input.value || true : false;
  }
  if (input.type === 'radio') {
    return input.checked ? input.value : null;
  }
  return input.value;
}

export default function (elem, prop = '', getValue = getInputValue) {
  return function (e) {
    const input = e.currentTarget;
    const name = prop || input.name || 'value';
    (elem || input)[name] = getValue(input);
  };
}
