import './index.css';
import create, { slot } from '../../src/vdom';
import kickflip from '../../src/index';
import React from 'react';
import ReactDOM from 'react-dom';


kickflip('x-app', {
  render () {
    create('x-list', function () {
      for (let key = 0; key < 10; key++) {
        create('x-item', `Item ${key}`);
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


ReactDOM.render(React.createElement(Xapp), document.getElementById('react'));

