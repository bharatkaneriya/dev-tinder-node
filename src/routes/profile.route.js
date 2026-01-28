const express = require('express');
const ProfileRoute=express.Router();
const { myProfile } = require('../controllers/myProfile.controller');
const { userAuth } = require('../middlewares/auth.middleware');

ProfileRoute.get('/',userAuth,myProfile);

module.exports = ProfileRoute;