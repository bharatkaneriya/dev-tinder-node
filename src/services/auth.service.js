const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Register User
 */
exports.registerService = async (req) => {
    await validateEmailService(req);
    await validateUsernameService(req);

    const { firstName, lastName, userName, email, password } = req.body;

    const userData = {
        firstName,
        lastName,
        userName,
        email,
        password,
    };

    return await User.create(userData);
};

/**
 * Validate Email
 */
exports.validateEmailService = async (req) => {
    const { email } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new ApiError(400, "Email already registered");
    }

    return true;
};

/**
 * Validate Username
 */
exports.validateUsernameService = async (req) => {
    const { userName } = req.body;

    const usernameExists = await User.findOne({ userName });
    if (usernameExists) {
        throw new ApiError(400, "Username already taken");
    }

    return true;
};

/**
 * Login User
 */
exports.loginService = async (req) => {
    const { email, password, deviceId, deviceType } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = await user.generateAccessToken();

    // Remove existing device session (re-login same device)
    user.devices = user.devices.filter(d => d.deviceId !== deviceId);

    // Add new device session
    user.devices.push({
        deviceId: deviceId ?? '',
        deviceType: deviceType ?? '',
        accessToken: accessToken,
        lastLoginAt: new Date(),
    });

    await user.save();

    const data= {
        accessToken,
        expiresIn: '1d',
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    };

    return data;
};


exports.forgotPasswordService = async (req) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if (!user) throw new ApiError(404, "User not found");

    if (
        user.forgotPassword?.createdAt &&
        user.forgotPassword.createdAt > Date.now() - 1 * 60 * 1000 // 1 min wait
    ) {
        throw new ApiError(400,"Please wait 1 min before requesting again");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('password code: ',code)
    const codeHash = await bcrypt.hash(code,10);

     user.forgotPassword = {
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        createdAt: new Date(Date.now()),
        attempts: 0,
    };
    await user.save();

    // Send email here
    return;
};


exports.verifyForgotPasswordService = async (req) => {
    const {email, code} = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");

    if(!user?.forgotPassword){
        throw new ApiError(400, "Forgot password request not found!");
    }

    const fp=user.forgotPassword;

    if (fp.attempts >= 5) {
        throw new ApiError(429, "Too many attempts, resend code");
    }

    if (fp.expiresAt < Date.now()) {
        throw new ApiError(400, "Code expired, please resend");
    }

    const isValidcode = await bcrypt.compare(code, fp.codeHash);
    
    if(!isValidcode){
        user.forgotPassword.attempts += 1;
        await user.save();
        throw new ApiError(400, "Invalid code input!");
    }

    fp.verified = true;
    await user.save();

    const resetToken = jwt.sign(
        { userId: user._id, purpose: "reset-password" },
        process.env.RESET_PASSWORD_SECRET,
        { expiresIn: "15m" }
    );

    return {resetToken: resetToken};
};


exports.resetPasswordService = async (req) => {
    const {resetToken, newPassword} = req.body;
    let payload;

    try {
        payload = jwt.verify(
            resetToken,
            process.env.RESET_PASSWORD_SECRET
        );
    } catch {
        throw new ApiError(401, "Invalid or expired token");
    }

    if (payload.purpose !== "reset-password") {
        throw new ApiError(400,"Invalid reset password token");
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.forgotPassword?.verified) {
        throw new ApiError(400, "Password reset not authorized");
    }

    user.password = newPassword;
    user.markModified("password");
    user.forgotPassword = undefined;
    user.devices = []; // logout all devices

    await user.save();

    return;
};



/**
 * Logout
 */
exports.logoutService = async (req) => {
    console.log('logout service');
    const { logoutAll } = req.body;

    if (logoutAll) {
        await User.updateOne(
            { _id: req.user._id },
            { $set: { devices: [] } }
        );
    } else {
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { devices: { accessToken: req.accessToken } } }
        );
    }

    return true;
};

