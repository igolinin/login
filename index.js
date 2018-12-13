require("express-async-errors");
require("dotenv").config();
const error = require("./middleware/error");
const express = require("express");
const user = require("./routes/user");
const login = require("./routes/login");
const bodyParser = require("body-parser");
const config = require("config");
const database = config.get("db.host");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    database,
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to mongo db at ", database))
  .catch(err => console.log("cannot connect to db", err));
//const db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("OK here");
});

app.use("/api/v1/user", user);
app.use("/api/v1/auth", login);

app.use(error);

app.listen(8080, () => console.log("server started on port 8080"));

module.exports = app;
