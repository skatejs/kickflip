import 'skatejs-named-slots';
import { emit } from '../src/index';
import { number } from '../src/properties';
import * as IncrementalDOM from 'incremental-dom';
import kickflip from '../src/kickflip';
import state from '../src/state';
import vdom, { IncrementalDOM as VdomIncrementalDOM } from '../src/vdom';
import version from '../src/version';

let componentCount = 0;

function component (opts) {
  return kickflip(`my-el-${++componentCount}`, opts);
}

function element (opts) {
  return component(opts)();
}

describe('kickflip', function () {
  it('kickflip', function () {
    expect(kickflip).to.be.a('function');
  });

  it('state', function () {
    expect(state).to.be.a('function');
  });

  it('vdom', function () {
    expect(vdom).to.be.a('function');
  });

  it('version', function () {
    expect(version).to.be.a('string');
  });
});

describe('events (on*)', function () {
  it('should not duplicate listeners', function (done) {
    const myel = component({
      properties: {
        test: number({ default: 0 })
      },
      created (elem) {
        elem._test = 0;
      },
      render (elem) {
        vdom('div', {
          onevent () {
            elem._test++;
          }
        }, elem.test);
      }
    });

    const el = myel();
    const shadowDiv = el.shadowRoot.children[0];

    // Ensures that it rendered.
    expect(shadowDiv.textContent).to.equal('0');
    expect(el._test).to.equal(0);

    // Trigger the handler.
    emit(shadowDiv, 'event');

    // Ensure the event fired.
    expect(el._test).to.equal(1);

    // Re-render.
    el.test++;

    setTimeout(function () {
      expect(shadowDiv.textContent).to.equal('1');
      emit(shadowDiv, 'event');
      expect(el._test).to.equal(2);

      el.test++;
      setTimeout(function () {
        expect(shadowDiv.textContent).to.equal('2');
        emit(shadowDiv, 'event');
        expect(el._test).to.equal(3);
        done();
      }, 100);
    }, 100);
  });

  it('should not trigger events bubbled from descendants', function () {
    let called = false;
    const test = () => called = true;
    const myel = component({
      render () {
        vdom('div', { ontest: test }, vdom.bind(null, 'span'));
      }
    })();

    emit(myel.querySelector('span'), 'test');
    expect(called).to.equal(false);
  });

  it('should not fail for listeners that are not functions', function () {
    const myel = component({
      render () {
        vdom('div', { ontest: null });
      }
    })();
    emit(myel.shadowRoot.firstChild, 'test');
  });
});

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});

describe('properties', function () {
  it('class -> className', function () {
    const elem = element({
      render () {
        vdom('div', { class: 'test' });
      }
    });
    expect(elem.shadowRoot.firstChild.className).to.equal('test');
  });

  it('false should remove the attribute', function () {
    const elem = element({
      render () {
        vdom('div', { test: false });
      }
    });
    expect(elem.shadowRoot.firstChild.hasAttribute('test')).to.equal(false);
  });
});
