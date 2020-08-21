const { PNG } = require('pngjs');
const libheif = require('../');

const readStdin = () => new Promise(resolve => {
  const result = [];

  process.stdin.on('readable', () => {
    let chunk;

    while ((chunk = process.stdin.read())) {
      result.push(chunk);
    }
  });

  process.stdin.on('end', () => {
    resolve(Buffer.concat(result));
  });
});

const png = ({ data, width, height }) => {
  const png = new PNG({ width, height });
  png.data = Buffer.from(data);

  return PNG.sync.write(png, {
    width: width,
    height: height,
    deflateLevel: 9,
    deflateStrategy: 3,
    filterType: -1,
    colorType: 6,
    inputHasAlpha: true
  });
};

const decodeImage = async (image) => {
  const width = image.get_width();
  const height = image.get_height();

  const arrayBuffer = await new Promise((resolve, reject) => {
    image.display({ data: new Uint8ClampedArray(width*height*4), width, height }, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      // get the ArrayBuffer from the Uint8Array
      resolve(displayData.data.buffer);
    });
  });

  return { width, height, data: arrayBuffer };
};

(async () => {
  const input = await readStdin();
  const decoder = new libheif.HeifDecoder();
  const img = decoder.decode(input);

  const { data, width, height } = await decodeImage(img[0]);
  const output = png({ data, width, height });

  process.stdout.write(output);
})();
