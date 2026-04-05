const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const encodeRoute = require("./routes/encode");
const decodeRoute = require("./routes/decode");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const isPng = file.mimetype === "image/png" || file.mimetype === "image/x-png";

    if (!isPng) {
      return cb(new Error("Only PNG images are supported"));
    }

    cb(null, true);
  }
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api", encodeRoute(upload));
app.use("/api", decodeRoute(upload));

app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || "Request failed" });
  }
  next();
});

app.listen(3000, () => {
  console.log("🔥 Server running on http://localhost:3000");
});