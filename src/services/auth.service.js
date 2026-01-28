const bcrypt = require("bcrypt");
const User = require("../models/user.model");

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
const validateEmailService = async (req) => {
    const { email } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error("Email already exists");
    }

    return true;
};

/**
 * Validate Username
 */
const validateUsernameService = async (req) => {
    const { userName } = req.body;

    const usernameExists = await User.findOne({ userName });
    if (usernameExists) {
        throw new Error("Username already exists");
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
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
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


/**
 * Forgot Password
 */
exports.forgotPasswordService = async (req) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    // Example token (replace with crypto / JWT)
    const resetToken = Math.random().toString(36).substring(2, 15);

    user.passwordToken = resetToken;
    user.passwordTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    return { resetToken };
};

/**
 * Reset Password
 */
exports.resetPasswordService = async (req) => {
    const { email, passwordToken, password } = req.body;

    const user = await User.findOne({
        email,
        passwordToken,
        passwordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired token");
    }

    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpiry = null;

    await user.save();
    return true;
};
