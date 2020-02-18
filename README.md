# libheif-js

> An Emscripten build of [`libheif`](https://github.com/strukturag/libheif) distributed as an npm module for Node.JS and the browser.

[![travis][travis.svg]][travis.link]
[![npm-downloads][npm-downloads.svg]][npm.link]

[travis.svg]: https://travis-ci.com/catdad-experiments/libheif-js.svg?branch=master
[travis.link]: https://travis-ci.com/catdad-experiments/libheif-js
[npm-downloads.svg]: https://img.shields.io/npm/dm/libheif-js.svg
[npm.link]: https://www.npmjs.com/package/libheif-js

This module will respect the major and minor versions of the included `libheif`, with the patch version representing changes in this module itself. For the exact version of `libheif`, please see the [install script](scripts/install.js).

## Install

```bash
npm install libheif-js
```

## Related

This module contains the low-level `libheif` implementation. For more user-friendly functionality, check out these projects:

* [heic-cli](https://github.com/catdad-experiments/heic-cli) - convert heic/heif images to jpeg or png from the command line
* [heic-convert](https://github.com/catdad-experiments/heic-convert) - convert heic/heif images to jpeg and png
* [heic-decode](https://github.com/catdad-experiments/heic-decode) - decode heic images to raw image data
