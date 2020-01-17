/* eslint-env mocha */
const { expect } = require('chai');

const libheif = require('../');

describe('libheif', () => {
  it('has a decoder property', () => {
    expect(libheif).to.have.property('HeifDecoder')
      .and.to.be.a('function');
  });
});
