import kickflip from '../src/kickflip';
import state from '../src/state';
import vdom from '../src/vdom';
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
