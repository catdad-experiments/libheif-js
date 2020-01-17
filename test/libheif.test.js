/* eslint-env mocha */
const path = require('path');
const crypto = require('crypto');

const fs = require('fs-extra');
const root = require('rootrequire');
const { expect } = require('chai');

const libheif = require('../');

describe('libheif', () => {
  it('has a decoder property', () => {
    expect(libheif).to.have.property('HeifDecoder')
      .and.to.be.a('function');
  });

  it('can decode a known image', async () => {
    const file = await fs.readFile(path.resolve(root, 'temp', '0002.heic'));
    const decoder = new libheif.HeifDecoder();
    const data = decoder.decode(file);

    expect(data).to.have.property('length').and.to.be.above(0);

    const image = data[0];
    const width = image.get_width();
    const height = image.get_height();

    expect(image).to.have.property('display').and.to.be.a('function');
    expect(width).to.equal(1440);
    expect(height).to.equal(960);

    const arrayBuffer = await new Promise((resolve, reject) => {
      image.display({ data: new Uint8ClampedArray(width*height*4), width, height }, (displayData) => {
        if (!displayData) {
          return reject(new Error('HEIF processing error'));
        }

        // get the ArrayBuffer from the Uint8Array
        resolve(displayData.data.buffer);
      });
    });

    const buffer = Buffer.from(arrayBuffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    expect(hash).to.equal('fe4585b4d72109d470c01acf74b7301b88bf2df4b865daadc3e35d3413d1228f');
  });
});
