// write a simple http server that serves documents as requested,
// and for documents with filename ending in "dot" applies special treatment:
// return an HTML page with an SVG image which is a graphviz rendering of the dot file.

var http = require('http');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;

var server = http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var filename = '.' + pathname;
  fs.exists
  (filename, function(exists) {
    if (exists) {
      fs.readFile
      (filename, function(err, data) {
        if (err) {
          res.writeHead(500);
          res.end('Server Error!');
          return;
        }
        if (pathname.match(/\.dot$/)) {
          exec('dot -Tsvg ' + filename, function(err, stdout, stderr) {
            if (err) {
              res.writeHead(500);
              res.end('Graphviz Error!');
              return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<!DOCTYPE html><html><body><img src="data:image/svg+xml;base64,' + new Buffer(stdout).toString('base64') + '"></body></html>');
          });
        } else {
          res.writeHead(200);
          res.end(data);
        }
      });
    }
    else {
      res.writeHead(404);
      res.end('Not Found!');
    }
  }

  );
}
);

server.listen(8000);
console.log('Server running at http://localhost:8000/');
