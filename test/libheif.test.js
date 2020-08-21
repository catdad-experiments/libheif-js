/* eslint-env mocha */
const path = require('path');

const fs = require('fs-extra');
const root = require('rootrequire');
const { expect } = require('chai');
const { PNG } = require('pngjs');
const toUint8 = require('buffer-to-uint8array');
const pixelmatch = require('pixelmatch');

const libheif = require('../');

describe('libheif', () => {
  const readControl = async name => {
    const buffer = await fs.readFile(path.resolve(root, `temp/${name}`));
    const { data, width, height } = PNG.sync.read(buffer);

    return { data, width, height };
  };

  const compare = (expected, actual, width, height, errString = 'actual image did not match control image') => {
    const result = pixelmatch(toUint8(Buffer.from(expected)), toUint8(Buffer.from(actual)), null, width, height, {
      threshold: 0.1
    });

    // allow 1% of pixels to be different
    expect(result).to.be.below(width * height * 0.01, errString);
  };

  it('has a decoder property', () => {
    expect(libheif).to.have.property('HeifDecoder')
      .and.to.be.a('function');
  });

  it('can decode a known image', async () => {
    const control = await readControl('0002-control.png');
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

    compare(control.data, arrayBuffer, control.width, control.height);
  });
});
