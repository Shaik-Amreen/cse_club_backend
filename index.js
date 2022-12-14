const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./database/db");
const path = require("path");
const users = require("./routers/users");
const task = require("./routers/task");
const submission = require("./routers/submission");
const student = require('./routers/studentRoutes')

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10000mb", extended: true }));
app.use(cookieParser());

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use("/", users);
app.use("/task", task);
app.use("/submission", submission);
app.use("/student", student);

const host = "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => console.log("server listened" + port + host));
