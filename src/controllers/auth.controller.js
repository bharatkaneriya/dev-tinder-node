const {
    registerValidator,
    loginValidator,
    validateUsernameValidator,
    validateEmailValidator,
    forgotPasswordValidator,
    verifyForgotPasswordValidator,
    resetPasswordValidator
} = require('../validations/auth.validation');
const {
    registerService, 
    validateEmailService, 
    validateUsernameService, 
    loginService, 
    forgotPasswordService,
    verifyForgotPasswordService,
    resetPasswordService,
    logoutService
} = require('../services/auth.service');

exports.regsiter = async (req,res,next) => {
    try{
        await registerValidator(req);
        const user = await registerService(req);
        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
        
    }
    catch(err){
        console.log(err);
        res.status(400).json({ success: false, data: {},message: err.message });
    }
};

exports.validateEmail = async (req,res) => {
    try{
        await validateEmailValidator(req);
        await validateEmailService(req);

        res.status(200).json({ success: true, data: {},message:"Email is valid" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}

exports.validateUsername = async (req,res) => {
    try{
        await validateUsernameValidator(req);
        await validateUsernameService(req);

        res.status(200).json({ success: true, data: {},message:"Username is valid!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}

exports.login = async (req, res) => {
    try{
        loginValidator(req);
        const user = await loginService(req);
        
        res.status(200).json({ success: true, data: user,message:"Login successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}


exports.forgotPassword = async (req, res) => {
    try{
        await forgotPasswordValidator(req);
        await forgotPasswordService(req);
        
        res.status(200).json({ success: true, data: {},message:"Code sent successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}

exports.verifyForgotPasswordCode = async (req, res) => {
    try{
        await verifyForgotPasswordValidator(req);
        const tokenData = await verifyForgotPasswordService(req);
        
        res.status(200).json({ success: true, data: tokenData,message:"Code verifyed successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}


exports.resetPassword = async (req,res) => {
    try{
        await resetPasswordValidator(req);
        await resetPasswordService(req);
        
        res.status(200).json({ success: true, data: {}, message:"Password reset successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}

exports.logout = async (req, res) => {
    try{
        await logoutService(req);
        res.status(200).json({ success: true, data: {},message:"Logout success!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: {},message: err.message });
    }
}