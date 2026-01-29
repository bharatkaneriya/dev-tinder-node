const {mongoose, Schema} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const deviceSchema = new mongoose.Schema({
    deviceId: { 
        type: String 
    },
    deviceType: { 
        type: String,
        enum: ["","android", "ios", "web"],
    },
    accessToken: { 
        type: String,
        required: true,
        index: true 
    },
    lastLoginAt: { 
        type: Date,
        default: Date.now 
    },
});

const forgotPasswordSchema = new mongoose.Schema({
    codeHash: String,
    expiresAt: Date,
    createdAt: Date,
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    
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
            required: [true, 'Password is required!'],
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Other"],
                message: "{VALUE} is not a valid gender"
            }
        },
        location: {
            type:String
        },
        avatar: {
            type: String, // cloudinary url
        },
        coverImage: {
            type: String, // cloudinary url
        },
        title: {
            type: String,
            lowercase: true,
            trim: true,
        },
        about: {
            type: String,
        },
        skills: {
            type: [String],
            index: true,
        },
        experience: [
            {
                company: String,
                role: String,
                startDate: Date,
                endDate: Date,
            },
        ],
        education: [
            {
                institute: String,
                degree: String,
                startYear: Number,
                endYear: Number,
            },
        ],
        isProfileComplated: {
            type:Boolean,
            default: false,
            index: true,
        },
        status: {
            type: String,
            enum: {
                values: ["active", "inactive"],
                message: "{VALUE} is not a valid status"
            },
            default: 'active'
        },
        forgotPassword: forgotPasswordSchema,
        devices: [deviceSchema],
    },
    {
        timestamps:true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
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
            title: this.title,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}



module.exports = mongoose.model('User',userSchema);