/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const root = require('rootrequire');

const libheifDir = path.resolve(root, 'libheif');
const libheif = path.resolve(libheifDir, 'libheif.js');
const libheifLicense = path.resolve(libheifDir, 'LICENSE');

const version = 'v1.7.0';

const base = `https://github.com/catdad-experiments/libheif-emscripten/releases/download/${version}`;
const lib = `${base}/libheif.js`;
const license = `${base}/LICENSE`;

const response = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`failed response: ${res.status} ${res.statusText}`);
  }

  return await res.buffer();
};

(async () => {
  await fs.outputFile(libheif, await response(lib));
  await fs.outputFile(libheifLicense, await response(license));
})().then(() => {
  console.log(`fetched libheif ${version}`);
}).catch(err => {
  console.error(`failed to fetch libheif ${version}\n`, err);
  process.exitCode = 1;
});
