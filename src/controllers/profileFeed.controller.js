const User = require('../models/user.model');

const profileFeed = async (req,res,next) => {
    try{
        const users= await User.find({});
        res.status(200).json({ success: true, data: users,message:"Profile feed get successfully!" });

    }catch(err){
        console.error(err);
        res.status(400).json({ success: false, data: [],message:"Error: "+err });
    }
};

module.exports = {
    profileFeed
};