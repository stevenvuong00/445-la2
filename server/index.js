const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const stream = require("stream");
const readStream = new stream.PassThrough();
const ffmpeg = require("ffmpeg");
const app = express();
const port = 3000;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/lab", urlencodedParser, (req, res) => {
  // let readableVideoBuffer = new stream.PassThrough();
  // ffmpeg();
  req.on("readable", function () {
    console.log(req.read());
    //   readableVideoBuffer.write(req.read());
    //   ffmpeg()
    //     .input(readableVideoBuffer)
    //     .inputFormat("mp4")
    //     .outputOptions([
    //       "-pix_fmt yuv420p",
    //       "-movflags frag_keyframe+empty_moov",
    //       "-movflags +faststart",
    //     ])
    //     // .videoCodec("libx264")
    //     .toFormat("mp4")
    //     .save("test.mp4");
  });
  // readableVideoBuffer.end();
  res.send(req.body);
});
