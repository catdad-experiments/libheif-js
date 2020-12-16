/* eslint-disable no-console */
const path = require('path');
const root = require('rootrequire');
const fs = require('fs-extra');
const fetch = require('node-fetch');

const resolve = (name = '') => path.resolve(root, 'temp', name);
const drive = id => `http://drive.google.com/uc?export=view&id=${id}`;

const images = [{
  name: '0001.jpg',
  url: drive('1Mdlwd9i4i4HuVJjEcelUj6b0OAYkQHEj')
}, {
  name: '0002.heic',
  url: drive('1J_761fe_HWSijAthq7h_D2Zsf1_es1cT')
}, {
  name: '0002-control.png',
  url: drive('1uomSNTAK5FifvI72lYi6T42zhvVv1LwH')
}, {
  name: '0003.heic',
  url: drive('1T2okNblxl4OzG_yR11HIZdK6IC0xg-8N')
}, {
  name: '0003-control.png',
  url: drive('1IID6zpjBu3DUBZZMvjHp7AKDX49bqbq7')
}].map(img => {
  img.path = resolve(img.name);
  return img;
});

(async () => {
  for (let image of images) {
    if (await fs.exists(image.path)) {
      console.log(`skipping ${image.name} because it already exists`);
      continue;
    }

    const { url, name } = image;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`failed to download ${name} at ${url}`);
    }

    const buffer = await res.buffer();
    await fs.outputFile(image.path, buffer);
  }
})().then(() => {
  console.log('all images fetch');
}).catch(err => {
  console.error('failed to fetch all images\n', err);
  process.exitCode = 1;
});
