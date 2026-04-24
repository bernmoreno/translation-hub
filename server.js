const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

http
  .createServer((req, res) => {
    const requestedPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(ROOT, decodeURIComponent(requestedPath));

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        fs.readFile(path.join(ROOT, "index.html"), (indexError, indexContent) => {
          if (indexError) {
            res.writeHead(500);
            res.end("Server error");
            return;
          }

          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(indexContent);
        });
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
      res.end(content);
    });
  })
  .listen(PORT, () => {
    console.log(`Lingo Drift running at http://localhost:${PORT}`);
  });
