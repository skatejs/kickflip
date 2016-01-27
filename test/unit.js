import version from '../src/version';

describe('kickflip', function () {
  it('version', function () {
    expect(version).to.be.a('string');
  });
});
