const express = require("express");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const server = express();
const readFile = promisify(fs.readFile);

server.engine("eng.html", (path, options, callback) => {
  return callback(null, "Hello");
  //   readFile(path)
  //     .then(buffer => {
  //       let renderedStr = buffer.toString();
  //       const variables = /{{.*}}/.exec(renderedStr);
  //       console.log(variables);
  //       return callback(null, renderedStr);
  //     })
  //     .catch(err => callback(err, null));
});

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "eng.html");

server.get("/", (req, res) => {
  return res.render("index", { name: "king", email: "mail@mail.com" });
});

server.listen(8000, () => console.log("Server running..."));
