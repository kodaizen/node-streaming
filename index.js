var http = require("http");
const fs = require("fs");

http
  .createServer(function (req, res) {
    const filePath = "./music.mp3";
    const range = req.headers.range;
    const fileStat = fs.statSync(filePath);

    if (!range) {
      const fileStream = fs.createReadStream(filePath);
      res.writeHead(206, {
        "Content-Type": "audio/mpeg",
        "Content-Length": fileStat.size,
      });
      fileStream.pipe(res);
    } else {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;
      if (start >= fileStat.size) {
        res.writeHead(416, { "Content-Type": "text/html" });
        res.end(
          "Requested range not satisfiable\n" + start + " >= " + audio.size
        );
      }
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg",
      });
      fileStream.pipe(res);
    }
  })
  .listen(3000);
