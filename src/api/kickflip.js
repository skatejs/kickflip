import render from 'api/render';
import skate from 'skatejs';

function linkPropsToAttrsIfNotSpecified (props) {
  Object.keys(props || {}).forEach(function (name) {
    const prop = props[name];
    if (typeof prop.attribute === 'undefined') {
      prop.attribute = true;
    }
  });
}

export default function (name, opts) {
  linkPropsToAttrsIfNotSpecified(opts.properties);
  opts.render = render(opts.render);
  return skate(name, opts);
}