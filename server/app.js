var express = require("express");
var fs = require("fs");

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

app.get("/api/v1/image", function (req, res) {
  const imagesDir = __dirname + "/public/images";
  const files = fs.readdirSync(imagesDir);

  const index = req.query.id
    ? parseInt(req.query.id)
    : Math.floor(Math.random() * files.length);

  console.log(`Found ${files.length} files, serving ${index}`);
  const file = files[index];

  const stream = fs.createReadStream(imagesDir + "/" + file);
  stream.on("open", () => {
    res.set("Content-Type", "image/jpeg");
    stream.pipe(res);
  });
  stream.on("error", (e) => {
    console.error(e);
    res.set("Content-Type", "text/plain");
    res.status(404).end("Not found");
  });
});

module.exports = app;
