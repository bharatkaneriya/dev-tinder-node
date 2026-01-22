const express = require('express');
const app = express();
require('dotenv').config();

const { userAuth,adminAuth } = require('./middlewares/auth.middleware');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
});

// import routes
const authRouter = require('./routes/auth.route');
app.use("/v1",authRouter);

module.exports = app;