const express = require('express');
const authRouter = express.Router();

const multer = require("multer");
const upload = multer();

const {
    regsiter,
    login,
    logout
} = require('../controllers/auth.controller');
const { userAuth } = require('../middlewares/auth.middleware');


authRouter.post('/register',upload.none(),regsiter);
authRouter.post('/login',login);
authRouter.post('/logout',userAuth,logout);

module.exports = authRouter;