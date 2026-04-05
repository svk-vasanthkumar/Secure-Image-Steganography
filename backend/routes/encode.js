const express = require("express");
const { encrypt } = require("../utils/aes");
const { encodeImage } = require("../utils/stego");

module.exports = (upload) => {
  const router = express.Router();

  router.post("/encode", upload.single("image"), async (req, res) => {
    try {
      const { message, password } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      if (!req.file.mimetype || !req.file.mimetype.includes("png")) {
        return res.status(400).json({ message: "Only PNG allowed ❌" });
      }

      if (!message || !password) {
        return res.status(400).json({ message: "Message and password are required" });
      }

      const encrypted = encrypt(message, password);
      const finalString = JSON.stringify(encrypted);

      const output = "uploads/encoded.png";
      await encodeImage(req.file.path, finalString, output);

      res.download(output);

    } catch (err) {
      if (err.message === "Message is too large for this image") {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).json({ message: "Encoding failed ❌" });
    }
  });

  return router;
};