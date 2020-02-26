const express = require("express");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const server = express();
const readFile = promisify(fs.readFile);

server.engine("eng.html", (path, options, callback) => {
  readFile(path)
    .then(buffer => {
      let renderedStr = buffer.toString();
      const variables = Object.keys(options);
      variables.splice(variables.indexOf("settings"), 1);
      variables.splice(variables.indexOf("_locals"), 1);
      variables.splice(variables.indexOf("cache"), 1);

      variables.forEach(variable => {
        if (typeof variable !== "object" && typeof variable !== "function")
          renderedStr = renderedStr.replace(
            new RegExp(`{{${variable}}}`, "g"),
            options[variable]
          );
      });

      return callback(null, renderedStr);
    })
    .catch(err => callback(err, null));
});

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "eng.html");

server.use(express.static(path.join(__dirname, "static")));

server.get("/", (req, res) => {
  return res.render("index", { name: "king", email: "mail@mail.com" });
});

server.listen(8000, () => console.log("Server running..."));
