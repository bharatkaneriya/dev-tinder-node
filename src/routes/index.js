const router = require("express").Router();

const authRouter = require("./auth.route");
const ProfileRoute = require("./profile.route");
const profileFeedRouter = require("./profileFeed.route");

router.use("/auth", authRouter);
router.use("/profile-feed", profileFeedRouter);
router.use("/myprofile", ProfileRoute);

module.exports = router;
