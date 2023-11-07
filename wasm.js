// I technically don't have to do this, but I am keeping it around
// for demonstration purposes
const fs = require('fs');
const wasmBinary = fs.readFileSync('./libheif-wasm/libheif.wasm');

module.exports = require('./libheif-wasm/libheif.js')({ wasmBinary });
