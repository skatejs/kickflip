import './index.css';
import kf, { render } from '../../src/index';
import create, { div, table, tbody, td, tr } from '../../src/vdom';

kf('my-element', {
  render () {
    create('span', 'Test content');
  }
});
kf('slow-table', {
  created (elem) {
    console.time('render');
    elem.secondsElapsed = 0;
  },
  ready () {
    console.timeEnd('render');
  },
  attached (elem) {
    elem._ival = setInterval(function () {
      console.time('re-render');
      elem.secondsElapsed++;
      render(elem);
      console.timeEnd('re-render');
    }, 1000);
  },
  detached (elem) {
    clearInterval(elem._ival);
  },
  render (elem) {
    div(elem.secondsElapsed);
    table(function () {
      tbody(function () {
        for (let a = 0; a < 20000; a++) {
          tr(function () {
            td('Name');
            td('Surname');
            td('Phone number');
            td(function () {
              create('my-element');
            });
          });
        }
      });
    });
    div(elem.secondsElapsed);
  }
});
document.querySelector('button').addEventListener('click', function() {
  setTimeout(function() {
    document.getElementById('container').innerHTML = '<slow-table></slow-table>';
  }, 50);
});


// kf('x-todo-app', {
//   events: {
//     add (e) {
//       this.items.push(e.detail);
//       render(this);
//     },
//     remove (e) {
//       this.items.splice(this.items.indexOf(e.detail), 1);
//       render(this);
//     }
//   },
//   properties: {
//     items: {
//       attribute: false,
//       default () { return []; }
//     }
//   },
//   ready (elem) {
//     for (let a = 0; a < 10000; a++) {
//       elem.items.push(`Item ${a + 1}`);
//     }
//     elem.items = elem.items;
//   },
//   render (elem) {
//     return create('x-todos', function () {
//       elem.items.forEach(function (val, key) {
//         create('x-item', { key }, val);
//       });
//     });
//   }
//   // render (elem) {
//   //   elementOpen('x-todos');
//   //     elem.items.forEach(function (item, index) {
//   //       elementOpen('x-item', item, { key: index });
//   //         text(item);
//   //       elementClose('x-item');
//   //     });
//   //   elementClose('x-todos');
//   // }
// });

// kf('x-todos', {
//   events: {
//     submit (e) {
//       e.preventDefault();
//       emit(this, 'add', { detail: this.value });
//       this.value = '';
//     }
//   },
//   properties: {
//     value: properties.string({ default: '' })
//   },
//   render (elem) {
//     return create('form', function () {
//       create('input', { onkeyup: link(elem), type: 'text', value: elem.value });
//       text(' ');
//       create('button', { class: 'add', type: 'submit' }, 'add item');
//       create('slot', { name: '' });
//     });
//   }
//   // render (elem) {
//   //   elementOpen('form');
//   //     elementVoid('input', null, null, 'onkeyup', link(elem), 'type', 'text', 'value', elem.value);
//   //     text(' ');
//   //     elementOpen('button', null, null, 'class', 'add', 'type', 'submit');
//   //       text('add item');
//   //     elementClose('button');
//   //   elementClose('form');
//   //   elementOpen('div', null, null, 'slot-name', '');
//   //     skip();
//   //   elementClose('div');
//   // }
// });

// kf('x-item', {
//   events: {
//     'click button' () {
//       emit(this, 'remove', { detail: this.textContent });
//     }
//   },
//   render () {
//     create('slot', { name: '' });
//     text(' ');
//     create('button', { type: 'button' }, 'x');
//   }
//   // render () {
//   //   elementOpen('span', null, null, 'slot-name', '');
//   //     skip();
//   //   elementClose('span');
//   //   text(' ');
//   //   elementOpen('button', null, null, 'type', 'button');
//   //     text('x');
//   //   elementClose('button');
//   // }
// });
