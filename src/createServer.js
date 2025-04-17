/* eslint-disable no-console */
'use strict';

const http = require('node:http');
const fs = require('node:fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/plain');

    console.log(`req.url = ${req.url}`);

    const pathStart = '/file/';
    let reqUrl = '';
    let pathname = '';
    let shortPath;

    try {
      reqUrl = new URL(req.url || '', `http://${req.headers.host}`);
      pathname = reqUrl.pathname;

      if (pathname.includes('//')) {
        res.statusCode = 404;
        res.statusMessage = 'Invalid path to file';
        res.end('Invalid path to file');

        return;
      }

      if (!pathname.startsWith(pathStart)) {
        res.statusCode = 200;
        res.statusMessage = 'Invalid route. Path should start with "/file/"';
        res.end('Invalid route. Path should start with "/file/"');

        return;
      }

      shortPath = './public/' + pathname.slice(pathStart.length);

      if (shortPath) {
        fs.readFile(shortPath, (err, data) => {
          if (!err) {
            res.statusCode = 200;
            res.end(data);

            return;
          }

          res.statusCode = 404;
          res.statusMessage = 'File not found';
          res.end('File not found');
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  return server;
}

module.exports = {
  createServer,
};
