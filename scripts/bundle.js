import libheif from '../libheif-wasm/libheif.js';
import wasmBinary from '../libheif-wasm/libheif.wasm';

export default (opts = {}) => libheif({ ...opts, wasmBinary });
