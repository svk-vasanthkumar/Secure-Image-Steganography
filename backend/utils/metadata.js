// create metadata
function createMetadata(encryptedData) {
  return {
    version: "1.0",
    timestamp: Date.now(),
    payload: encryptedData
  };
}

// convert metadata → string
function serialize(metadata) {
  return JSON.stringify(metadata);
}

// string → metadata
function deserialize(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    throw new Error("Invalid hidden data ❌");
  }
}

module.exports = { createMetadata, serialize, deserialize };