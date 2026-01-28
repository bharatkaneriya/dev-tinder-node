const {
    registerValidator,
    loginValidator
} = require('../validations/auth.validation');
const {
    registerService, 
    validateEmailService, 
    validateUsernameService, 
    loginService, 
    forgotPasswordService, 
    resetPasswordService,
    logoutService
} = require('../services/auth.service');

exports.regsiter = async (req,res,next) => {
    try{
        registerValidator(req);
        const user = await registerService(req);
        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
        
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
};

exports.validateEmail = async (req,res) => {
    try{
        registerValidator(req);
        await validateEmailService(req);

        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}

exports.validateUsername = async (req,res) => {
    try{
        registerValidator(req);
        await validateUsernameService(req);

        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}

exports.login = async (req, res) => {
    try{
        loginValidator(req);
        const user = await loginService(req);
        
        res.status(200).json({ success: true, data: user,message:"Login successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}

exports.logout = async (req, res) => {
    try{
        await logoutService(req);
        res.status(200).json({ success: true, data: [],message:"Logged success!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        registerValidator(req);
        await forgotPasswordService(req);
        
        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}

exports.resetPassword = async (req,res) => {
    try{
        registerValidator(req);
        resetPasswordService(req);
        
        res.status(200).json({ success: true, data: user,message:"Registered successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
}