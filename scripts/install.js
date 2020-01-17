/* eslint-disable no-console */
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const root = require('rootrequire');

const libheifDir = path.resolve(root, 'libheif');
const libheif = path.resolve(libheifDir, 'libheif.js');
const libheifLicense = path.resolve(libheifDir, 'LICENSE');

const version = 'v1.6.1';

const base = `https://github.com/catdad-experiments/libheif-emscripten/releases/download/${version}`;
const lib = `${base}/libheif.js`;
const license = `${base}/LICENSE`;

const responseStream = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`failed response: ${res.status} ${res.statusText}`);
  }

  return res.body;
};

(async () => {
  await fs.ensureDir(libheifDir);

  await pipeline(await responseStream(lib), fs.createWriteStream(libheif));
  await pipeline(await responseStream(license), fs.createWriteStream(libheifLicense));
})().then(() => {
  console.log(`fetched libheif ${version}`);
}).catch(err => {
  console.error(`failed to fetch libheif ${version}\n`, err);
  process.exitCode = 1;
});
