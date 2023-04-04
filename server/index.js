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
    cb(null, `video${Date.now()}.mp4`); // set the filename for the uploaded file
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
  console.log(file.buffer);

  // let readableVideoBuffer = new stream.PassThrough();
  // ffmpeg();
  // req.on("readable", function () {
  //   const req_read = req.read();
  // console.log(req_read);\
  // if(Object.prototype.toString.call(req_read) === 'UintA')
  // if (Object.prototype.toString.call(req_read) === "[object Uint8Array]") {
  //   console.log(req_read);
  //   fs.writeFileSync("video.webm", req_read, { flag: "a+" }, (err) => {
  //     if (err) throw err;
  //   });
  // const readable = new Readable();
  // readable._read = () => {};
  // readable.push(req_read);
  // readable.push(null);
  // const outputStream = fs.createWriteStream("video.webm");
  // readable.pipe(outputStream);
  // }
  // });
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
