var http = require("http");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./controllers/auth.controller");
const addUser = require("./controllers/addUser.controller");
const logger = require("./controllers/logger");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'static')));

app.get("/v1/logs", cors(), (req, res) => {
  const content = fs.readFileSync(`./combined.log`, {
    encoding: "utf8",
    flag: "r",
  });
  res.send(content);
});
// app.get("/v1/env", cors(), (req, res) => {
//   const content = fs.readFileSync(`./.env.production`, {
//     encoding: "utf8",
//     flag: "r",
//   });
//   res.send(content);
// });

app.get("/v1/login", cors(), auth.login);
app.post("/v1/addUser", cors(), addUser);

http.createServer(app).listen(3002, (err) => {
  if (err) logger("error", err);
  else logger("info", "login micro-service running on 3001");
});
module.exports = app;

/*
TODO: validate token on requests
*/
