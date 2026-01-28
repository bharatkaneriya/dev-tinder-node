const express = require('express');
const profileFeedRouter=express.Router();

const {profileFeed} = require('../controllers/profileFeed.controller');

profileFeedRouter.get('/',profileFeed);

module.exports = profileFeedRouter;