# libheif-js

> An Emscripten build of [`libheif`](https://github.com/strukturag/libheif) distributed as an npm module for Node.JS and the browser.

[![github actions test][github-actions-test.svg]][github-actions-test.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[github-actions-test.link]: https://github.com/catdad-experiments/libheif-js/actions?query=workflow%3ACI
[github-actions-test.svg]: https://github.com/catdad-experiments/libheif-js/actions/workflows/ci.yml/badge.svg
[npm-downloads.svg]: https://img.shields.io/npm/dm/libheif-js.svg
[npm.link]: https://www.npmjs.com/package/libheif-js
[npm-version.svg]: https://img.shields.io/npm/v/libheif-js.svg

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
