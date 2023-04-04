const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const { Readable } = require("stream");
// const readStream = new stream.PassThrough();
const ffmpeg = require("ffmpeg");
const app = express();
const port = 3000;
const fs = require("fs");
const multer = require("multer");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `video-${Date.now()}.webm`); // set the filename for the uploaded file
  },
});
const upload = multer({ storage: storage });

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/lab", upload.single("video"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
