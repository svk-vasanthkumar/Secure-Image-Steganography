const crypto = require("crypto");

function getKey(password) {
  return crypto.createHash("sha256").update(password).digest();
}

function encrypt(text, password) {
  const iv = crypto.randomBytes(16);
  const key = getKey(password);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(data, password) {
  const [ivHex, encrypted] = String(data).split(":");

  const isIvValid = /^[0-9a-fA-F]{32}$/.test(ivHex || "");
  const isCipherValid =
    typeof encrypted === "string" &&
    encrypted.length > 0 &&
    encrypted.length % 2 === 0 &&
    /^[0-9a-fA-F]+$/.test(encrypted);

  if (!isIvValid || !isCipherValid) {
    const err = new Error("Invalid encrypted payload format");
    err.code = "INVALID_ENCRYPTED_PAYLOAD";
    throw err;
  }

  try {
    const iv = Buffer.from(ivHex, "hex");
    const key = getKey(password);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    const decryptErr = new Error("Decryption failed");
    decryptErr.code = "DECRYPTION_FAILED";
    throw decryptErr;
  }
}

module.exports = { encrypt, decrypt };