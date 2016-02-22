import bench from 'skatejs-build/bench';
import create, { slot } from '../src/vdom';
import kickflip from '../src/kickflip';


const { React, ReactDOM } = window;


// Skate components.

kickflip('x-app', {
  render () {
    create('x-list', function () {
      for (let a = 0; a < 10; a++) {
        create('x-item', `Item ${a}`);
      }
    });
  }
});

kickflip('x-list', {
  render () {
    slot({ name: '' });
  }
});

kickflip('x-item', {
  render () {
    slot({ name: '' });
  }
});


// React components.

const Xapp = React.createClass({
  render () {
    const items = [];
    for (let a = 0; a < 10; a++) {
      items.push(a);
    }
    return React.createElement(Xlist, null,
      items.map(function (key) {
        return React.createElement(Xitem, { key }, `Item ${key}`);
      })
    );
  }
});

const Xlist = React.createClass({
  render () {
    return React.createElement('div', null, this.props.children);
  }
});

const Xitem = React.createClass({
  render () {
    return React.createElement('div', null, this.props.children);
  }
});


describe('', function () {
  let fixture;

  beforeEach(function () {
    fixture = document.createElement('div');
    document.body.appendChild(fixture);
  });

  afterEach(function () {
    document.body.removeChild(fixture);
  });

  describe('render', function () {
    bench('kickflip', function () {
      fixture.innerHTML = '<x-app></x-app>';
      fixture.innerHTML = '';
    });

    bench('react', function (d) {
      ReactDOM.render(React.createElement(Xapp), fixture, function () {
        ReactDOM.unmountComponentAtNode(fixture);
        d.resolve();
      });
    });
  });
});
