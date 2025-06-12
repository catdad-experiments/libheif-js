# libheif-js

> An Emscripten build of [`libheif`](https://github.com/strukturag/libheif) distributed as an npm module for Node.JS and the browser.

[![github actions test][github-actions-test.svg]][github-actions-test.link]
[![jsdelivr][jsdelivr.svg]][jsdelivr.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[github-actions-test.link]: https://github.com/catdad-experiments/libheif-js/actions?query=workflow%3ACI
[github-actions-test.svg]: https://github.com/catdad-experiments/libheif-js/actions/workflows/ci.yml/badge.svg
[npm-downloads.svg]: https://img.shields.io/npm/dm/libheif-js.svg
[npm.link]: https://www.npmjs.com/package/libheif-js
[npm-version.svg]: https://img.shields.io/npm/v/libheif-js.svg
[jsdelivr.svg]: https://img.shields.io/jsdelivr/npm/hm/libheif-js?color=bd33a4
[jsdelivr.link]: https://www.jsdelivr.com/package/npm/libheif-js

This module will respect the major and minor versions of the included `libheif`, with the patch version representing changes in this module itself. For the exact version of `libheif`, please see the [install script](scripts/install.js).

## Install

```bash
npm install libheif-js
```

## Usage

Starting with version 1.17, there are multiple variants of `libheif` that you can use:

* The default is still the classic pure-javascript implementation (for backwards compatibility, of course). You can still bundle this into your project with your bundler of choice.
  ```js
  const libheif = require('libheif-js');
  ```
* There is a `wasm` version available for use in NodeJS. This version will dymanically load the `.wasm` binary at runtime. While you may try to run this through a bundler, you are on your own for making it work.
  ```js
  const libheif = require('libheif-js/wasm');
  ```
* There is also a `wasm` version that is pre-bundled for you, which includes the `.wasm` binary inside the `.js` bundle. You will have a much easier time using this in your browser bundle project.
  ```js
  const libheif = require('libheif-js/wasm-bundle');
  ```

If you'd like to include this module directly into an `html` page using a `<script>` tag, you have the following options:

_Note: in the examples below, make sure to set the latest version when you use it. Always make sure to set a version, to make sure your website does not break unexpectedly when an update is released._

* Use the pure-javascript implementation, exposing a `libheif` global:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif/libheif.js"></script>
  ```
* Use the wasm bundle, exposing a `libheif` global:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.js"></script>
  ```
* Use the ES Module version, which now works in all major browsers and you should try it:
  ```html
  <script type="module">
    import libheif from 'https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.mjs';
  </script>
  ```

In all cases, you can use this sample code to decode an image:

```js
const file = fs.readFileSync('./temp/0002.heic');

const decoder = new libheif.HeifDecoder();
const data = decoder.decode(file);
// data in an array holding all images inside the heic file

const image = data[0];
const width = image.get_width();
const height = image.get_height();
```

In NodeJS, you might use this decoded data with other libraries, such as `pngjs`:

```js
const { PNG } = require('pngjs');

const imageData = await new Promise((resolve, reject) => {
  image.display({ data: new Uint8ClampedArray(width*height*4), width, height }, (displayData) => {
    if (!displayData) {
      return reject(new Error('HEIF processing error'));
    }

    resolve(displayData);
  });
});

const png = new PNG({ width: imageData.width, height: imageData.height });
png.data = imageData.data;

const pngBuffer = PNG.sync.write(png);
```

In the browser, you might use this decoded data with `canvas` to display or convert the image:

```js
const canvas = document.createElement('canvas');

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');
const imageData = context.createImageData(width, height);

await new Promise((resolve, reject) => {
  image.display(imageData, (displayData) => {
    if (!displayData) {
      return reject(new Error('HEIF processing error'));
    }

    resolve();
  });
});

context.putImageData(imageData, 0, 0);
```

## Related

This module contains the low-level `libheif` implementation. For more user-friendly functionality, check out these projects:

* [heic-cli](https://github.com/catdad-experiments/heic-cli) - convert heic/heif images to jpeg or png from the command line
* [heic-convert](https://github.com/catdad-experiments/heic-convert) - convert heic/heif images to jpeg and png
* [heic-decode](https://github.com/catdad-experiments/heic-decode) - decode heic images to raw image data
