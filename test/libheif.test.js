/* eslint-env mocha */
const path = require('path');

const fs = require('fs-extra');
const root = require('rootrequire');
const { expect } = require('chai');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const pkg = require('../package.json');

describe('libheif (JS)', () => {
  const moduleFile = '../';

  runTests(require(moduleFile));

  it('resolves to index file', () => {
    const expected = path.resolve(root, 'index.js');
    const actual = require.resolve(moduleFile);

    expect(actual).to.equal(expected);
  });
});

describe('libheif (WASM)', () => {
  const moduleFile = '../wasm';

  runTests(require(moduleFile));

  it('resolves to wasm file', () => {
    const expected = path.resolve(root, 'wasm.js');
    const actual = require.resolve(moduleFile);

    expect(actual).to.equal(expected);
  });
});

describe('libheif (WASM bundle)', () => {
  const moduleFile = '../wasm-bundle.js';

  runTests(require(moduleFile));

  it('resolves to wasm file', () => {
    const expected = path.resolve(root, 'wasm-bundle.js');
    const actual = require.resolve(moduleFile);

    expect(actual).to.equal(expected);
  });
});

describe('libheif (WASM esm bundle)', () => {
  let dynamicLibheif;
  let proxyTarget = {};

  const libheifProxy = new Proxy(proxyTarget, {
    get(target, prop) {
      return dynamicLibheif[prop];
    }
  });

  before(async () => {
    dynamicLibheif = (await import('../libheif-wasm/libheif-bundle.mjs')).default();
    // allows `expect(libheif).to.have.property(...)` work
    Object.assign(proxyTarget, dynamicLibheif);
  });

  runTests(libheifProxy);
});

function runTests(libheif) {
  const readControl = async name => {
    const buffer = await fs.readFile(path.resolve(root, `temp/${name}`));
    const { data, width, height } = PNG.sync.read(buffer);

    return { data, width, height };
  };

  const compare = (expected, actual, width, height, errString = 'actual image did not match control image') => {
    const result = pixelmatch(Buffer.from(expected), Buffer.from(actual), null, width, height, {
      threshold: 0.1
    });

    // allow 1% of pixels to be different
    expect(result).to.be.below(width * height * 0.01, errString);
  };

  it('is the correct version', () => {
    expect(libheif).to.have.property('heif_get_version')
      .and.to.be.a('function');
    expect(libheif.heif_get_version()).to.equal('1.17.1')
      .and.to.equal(pkg.version);
  });

  it('has a decoder property', () => {
    expect(libheif).to.have.property('HeifDecoder')
      .and.to.be.a('function');
  });

  [{
    name: 'can decode a known image',
    file: '0002.heic',
    control: '0002-control.png',
    size: {
      width: 1440,
      height: 960
    }
  }, {
    name: 'can decode a known image with an odd width',
    file: '0003.heic',
    control: '0003-control.png',
    size: {
      width: 1125,
      height: 2436
    }
  }].forEach(meta => {
    it(meta.name, async () => {
      const control = await readControl(meta.control);
      const file = await fs.readFile(path.resolve(root, 'temp', meta.file));
      const decoder = new libheif.HeifDecoder();
      const data = decoder.decode(file);

      expect(data).to.have.property('length').and.to.be.above(0);

      const image = data[0];
      const width = image.get_width();
      const height = image.get_height();

      expect(image).to.have.property('display').and.to.be.a('function');
      expect({ width, height }).to.deep.equal(meta.size);

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
}
