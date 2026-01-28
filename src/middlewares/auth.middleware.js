const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.userAuth = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userID = decodedObj._id;
        const user = await User.findOne({
            _id:userID,
            "devices.accessToken": token,
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token!",
            });
        }
        req.user = user;
        req.accessToken = token;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token!",
        });
    }
}