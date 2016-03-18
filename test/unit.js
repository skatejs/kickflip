import { emit } from '../src/index';
import { number } from '../src/properties';
import * as IncrementalDOM from 'incremental-dom';
import kickflip from '../src/kickflip';
import state from '../src/state';
import vdom, { IncrementalDOM as VdomIncrementalDOM } from '../src/vdom';
import version from '../src/version';

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
    const myel = kickflip('my-el1', {
      properties: {
        test: number({ default: 0 })
      },
      created (elem) {
        elem._test = 0;
      },
      render (elem) {
        vdom('div', { onevent () { elem._test++; } }, elem.test);
      }
    });

    const el = myel();
    const shadowDiv = el.__shadowRoot.children[0];

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
      }, 10);
    }, 10);
  });
});

describe('IncrementalDOM', function () {
  it('should export all the same members as the incremental-dom we consume', function () {
    expect(VdomIncrementalDOM).to.contain(IncrementalDOM);
  });
});
