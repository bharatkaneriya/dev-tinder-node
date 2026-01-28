const {mongoose, Schema} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String },
    deviceType: { type: String }, // android | ios | web
    accessToken: { type: String, required: true },
    lastLoginAt: { type: Date, default: Date.now },
});

const userSchema= new Schema({
        firstName: {
            type:String,
            required: [true, 'First name is required!'],
            trim:true
        },
        lastName: {
            type:String,
            trim:true
        },
        userName: {
            type:String,
            required: [true, 'User name is required!'],
            lowercase: true,
            trim:true,
            unique:true,
            index: true   
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            lowercase: true,
            trim: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required!']
        },
        age: {
            type: Number,
            min: 15
        },
        gender: {
            type: String
        },
        avatar: {
            type: String, // cloudinary url
        },
        coverImage: {
            type: String, // cloudinary url
        },
        totalExperience: {
            type:Number
        },
        profileTitle: {
            type: String,
            lowercase: true,
            trim: true,
        },
        profileDetails: {
            type: String,
        },
        isProfileComplated: {
            type:Boolean,
            default: false
        },
        devices: [deviceSchema],
    },
    {
        timestamps:true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    // next();
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fistName: this.fistName,
            lastName: this.lastName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}


module.exports = mongoose.model('User',userSchema);