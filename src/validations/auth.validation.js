const validator = require('validator');

exports.registerValidator = (req) => {
    const {firstName, lastName, userName, email, password} = req.body;
    if(!firstName){
        throw Error('First name is required!');
    }
    else if(firstName.length < 3 || firstName.length > 50){
        throw Error('First name must be 3 to 50 characters!');
    }
    else if(!userName){
        throw Error('Username name is required!');
    }
    else if(userName.length < 3 || userName.length > 50){
        throw Error('First name must be 3 to 50 characters!');
    }
    else if(!email){
        throw Error('Email is required!');
    }
    else if(!validator.isEmail(email)){
        throw Error('Email is invalid!');
    }
    else if(!password){
        throw Error('Password is required!');
    }
    else if(!validator.isStrongPassword(password)){
        throw Error('Password is week!');
    }
}


exports.loginValidator = (req) => {
    const {email, password} = req.body;
    if(!email){
        throw Error('Email is required!');
    }
    else if(!validator.isEmail(email)){
        throw Error('Email is invalid!');
    }
    else if(!password){
        throw Error('Password is required!');
    }
}

exports.resetPasswordValidator = (req) => {
    const {email, password} = req.body;
    if(!email){
        throw Error('Email is required!');
    }
    else if(!validator.isEmail(email)){
        throw Error('Email is invalid!');
    }   
}

exports.resetPasswordValidator = (req) => {
    const {firstName, lastName, userName, email, password} = req.body;
    if(!email){
        throw Error('Email is required!');
    }
    else if(!validator.isEmail(email)){
        throw Error('Email is invalid!');
    }
    else if(!password){
        throw Error('Password is required!');
    }
    else if(!validator.isStrongPassword(password)){
        throw Error('Password is week!');
    }
}