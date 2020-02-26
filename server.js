const express = require("express");
const path = require("path");
const viewEngine = require("./lib/engine");

const server = express();

server.engine("eng.html", viewEngine);

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
