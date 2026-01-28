exports.myProfile = async (req,res) => {
    try{
        const user = req.user;
        console.log(user);
        res.status(200).json({ success: true, data: user,message:"profile data fetch successfully!" });
    }
    catch(err){
        res.status(400).json({ success: false, data: [],message: err.message });
    }
};