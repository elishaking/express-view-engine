const express = require("express");
const fs = require("fs");
const { promisify } = require("util");

const server = express();
const readFile = promisify(fs.readFile);

server.engine("simple", (path, options, callback) => {
  readFile(path)
    .then(buffer => {
      let renderedStr = buffer.toString();
      const variables = /{{.*}}/.exec(renderedStr);
      console.log(variables);
      return callback(null, renderedStr);
    })
    .catch(err => callback(err, null));
});

server.set("views", "views");
server.set("view engine", "simple");
