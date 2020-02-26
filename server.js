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

      const forLoop = new RegExp(/{{for (\w+) in (\w+)}}(.*){{endfor}}/g).exec(
        JSON.stringify(renderedStr)
      );
      const forLoopVars = forLoop.slice(0, forLoop.length);
      const forLoopArr = options[forLoopVars[2]];
      if (forLoopArr) {
        let forLoopStrResult = "";
        const forLoopContent = forLoopVars[3]
          .replace(/\\r\\n(.*)\\r\\n/, "$1")
          .trim();
        for (let i = 0; i < forLoopArr.length; i++) {
          forLoopStrResult += forLoopContent.replace(
            new RegExp(`{{${forLoopVars[1]}}}`, "g"),
            forLoopArr[i]
          );
        }

        renderedStr = renderedStr.replace(
          new RegExp(
            `{{for ${forLoopVars[1]} in ${forLoopVars[2]}}}(.*){{endfor}}`,
            "s"
          ),
          forLoopStrResult
        );
      }

      return callback(null, renderedStr);
    })
    .catch(err => callback(err, null));
});

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "eng.html");

server.use(express.static(path.join(__dirname, "static")));

server.get("/", (req, res) => {
  return res.render("index", {
    name: "king",
    email: "mail@mail.com",
    jobs: ["CEO", "Dev"]
  });
});

server.listen(8000, () => console.log("Server running..."));
