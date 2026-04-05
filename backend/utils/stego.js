const { Jimp } = require("jimp");

// convert string → binary
function toBinary(str) {
  return str
    .split("")
    .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

// binary → string
function fromBinary(binary) {
  let result = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    result += String.fromCharCode(parseInt(byte, 2));
  }
  return result;
}

// 🔐 ENCODE (RGB)
async function encodeImage(path, message, output) {
  const img = await Jimp.read(path);

  const messageBinary = toBinary(message);

  // length header (32-bit)
  const lengthBinary = messageBinary.length.toString(2).padStart(32, "0");

  const fullBinary = lengthBinary + messageBinary;

  let index = 0;

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    if (index < fullBinary.length) {
      // RED
      this.bitmap.data[idx] =
        (this.bitmap.data[idx] & 254) | parseInt(fullBinary[index++]);
    }

    if (index < fullBinary.length) {
      // GREEN
      this.bitmap.data[idx + 1] =
        (this.bitmap.data[idx + 1] & 254) | parseInt(fullBinary[index++]);
    }

    if (index < fullBinary.length) {
      // BLUE
      this.bitmap.data[idx + 2] =
        (this.bitmap.data[idx + 2] & 254) | parseInt(fullBinary[index++]);
    }
  });

  await img.write(output);
}

// 🔓 DECODE (RGB)
async function decodeImage(path) {
  const img = await Jimp.read(path);

  let binary = "";

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    binary += (this.bitmap.data[idx] & 1).toString();     // R
    binary += (this.bitmap.data[idx + 1] & 1).toString(); // G
    binary += (this.bitmap.data[idx + 2] & 1).toString(); // B
  });

  // read length (first 32 bits)
  const lengthBinary = binary.slice(0, 32);
  const messageLength = parseInt(lengthBinary, 2);

  const messageBinary = binary.slice(32, 32 + messageLength);

  return fromBinary(messageBinary);
}

module.exports = { encodeImage, decodeImage };