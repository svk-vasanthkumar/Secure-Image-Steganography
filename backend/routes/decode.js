const express = require("express");
const { decrypt } = require("../utils/aes");
const { decodeImage } = require("../utils/stego");

module.exports = (upload) => {
  const router = express.Router();

  router.post("/decode", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      if (!req.file.mimetype || !req.file.mimetype.includes("png")) {
        return res.status(400).json({ message: "Only PNG allowed ❌" });
      }

      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const extracted = await decodeImage(req.file.path);
      const encryptedData = JSON.parse(extracted);
      const decrypted = decrypt(encryptedData, password);

      res.json({ message: decrypted });

    } catch (err) {
      if (err.message === "Wrong password or corrupted data ❌") {
        return res.status(401).json({ message: "Wrong password ❌" });
      }

      if (err.message === "Unexpected token u in JSON at position 0") {
        return res.status(400).json({ message: "Corrupted image data ❌" });
      }

      res.status(500).json({ message: "Wrong password or error ❌" });
    }
  });

  return router;
};