const express = require('express');
const authRouter = express.Router();

const multer = require("multer");
const upload = multer();

const {
    regsiter,
    login,
    logout,
    validateEmail,
    validateUsername,
    forgotPassword,
    verifyForgotPasswordCode,
    resetPassword
} = require('../controllers/auth.controller');
const { userAuth } = require('../middlewares/auth.middleware');


authRouter.post('/login',login);
authRouter.post('/register',upload.none(),regsiter);
authRouter.post('/register/validate-email',validateEmail);
authRouter.post('/register/validate-username',validateUsername);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/forgot-password/verify',verifyForgotPasswordCode);
authRouter.post('/reset-password',resetPassword);
authRouter.post('/logout',userAuth,logout);

module.exports = authRouter;