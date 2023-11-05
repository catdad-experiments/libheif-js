// I technically don't have to do this, but I am keeping it around
// for demonstration purposes
const fs = require('fs');
const wasmBinary = fs.readFileSync('./libheif-wasm/libheif.wasm');

module.exports = require('./libheif-wasm/libheif.js')({ wasmBinary });

// NOTE: for webpack, you need to do something like:
/*

import libheif from './libheif-wasm/libheif.js'
import wasmBinary from './libheif-wasm/libheif.wasm'

export default libheif({ wasmBinary });

*/

// then add this to rules:
/*

module.exports = {
  module: {
    rules: [{
      test: /\.wasm$/,
      type: "asset/inline",
    }]
  },
};

*/
