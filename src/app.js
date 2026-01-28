const express = require('express');
const app = express();
require('dotenv').config();
const errorHandler = require("./middlewares/error.middleware");

const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", routes);


// global error handler
app.use(errorHandler);

/* app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
}); */


module.exports = app;