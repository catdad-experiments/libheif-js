/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const root = require('rootrequire');
const tar = require('tar-stream');
const gunzip = require('gunzip-maybe');

const version = 'v1.17.1';

const base = `https://github.com/catdad-experiments/libheif-emscripten/releases/download/${version}`;
const tarball = `${base}/libheif.tar.gz`;

const getStream = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`failed response: ${res.status} ${res.statusText}`);
  }

  return res.body;
};

const autoReadStream = async stream => {
  let result = Buffer.from('');

  for await (const data of stream) {
    result = Buffer.concat([result, data]);
  }

  return result;
};

(async () => {
  for await (const entry of (await getStream(tarball)).pipe(gunzip()).pipe(tar.extract())) {
    const basedir = entry.header.name.split('/')[0];

    if (entry.header.type === 'file' && ['libheif', 'libheif-wasm'].includes(basedir)) {
      const outfile = path.resolve(root, entry.header.name);
      console.log(`  writing "${outfile}"`);
      await fs.outputFile(outfile, await autoReadStream(entry));
    } else {
      await autoReadStream(entry);
    }
  }
})().then(() => {
  console.log(`fetched libheif ${version}`);
}).catch(err => {
  console.error(`failed to fetch libheif ${version}\n`, err);
  process.exitCode = 1;
});
