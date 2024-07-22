/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const root = require('rootrequire');
const tar = require('tar-stream');
const gunzip = require('gunzip-maybe');

const esbuild = require('esbuild');

const version = 'v1.18.0';

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
  await fs.remove(path.resolve(root, 'libheif'));
  await fs.remove(path.resolve(root, 'libheif-wasm'));

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

  const buildOptions = {
    entryPoints: [path.resolve(root, 'scripts/bundle.js')],
    bundle: true,
    minify: true,
    external: ['fs', 'path', 'require'],
    loader: {
      '.wasm': 'binary'
    },
    platform: 'neutral'
  };

  await esbuild.build({
    ...buildOptions,
    outfile: path.resolve(root, 'libheif-wasm/libheif-bundle.js'),
    format: 'iife',
    globalName: 'libheif',
    footer: {
      // hack to support a single bundle as a node cjs module
      // and a browser <script>, similar to the js version libheif
      js: `
libheif = libheif.default;
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = libheif;
}`
    }
  });

  await esbuild.build({
    ...buildOptions,
    outfile: path.resolve(root, 'libheif-wasm/libheif-bundle.mjs'),
    format: 'esm',
    banner: {
      // hack to avoid the ENVIRONMENT_IS_NODE detection
      // the binary is built in, so the environment doesn't matter
      js: 'var process;'
    }
  });
})().then(() => {
  console.log(`fetched libheif ${version}`);
}).catch(err => {
  console.error(`failed to fetch libheif ${version}\n`, err);
  process.exitCode = 1;
});
