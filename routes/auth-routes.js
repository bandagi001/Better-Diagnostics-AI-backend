const authController = require('../controllers/auth-controller');

const express = require('express');
const authmiddleware = require('../utility/authmiddleware');
const authRouter = express.Router();
authRouter.get('/test', authController.testApi);
authRouter.post('/createUser', authController.createUser);
authRouter.post('/login', authController.login);
authRouter.post('/createSubscription', authController.createSubscription);
authRouter.get('/getallSubscription', authController.listSubscriptions);
authRouter.post('/sendOTP', authController.sendOtp);
authRouter.post('/validateOTP', authController.validateOTP);
authRouter.post('/resetPassword', authController.resetPassword);
authRouter.post('/validateEmail', authController.validateEmail);
authRouter.post('/getUserProfile', authmiddleware, authController.getUserProfile);
authRouter.post('/createUserProfile', authController.createUserProfile);
authRouter.post('/updateImageLimit', authmiddleware, authController.updateImageLimit);
authRouter.post('/getUserTableItem', authmiddleware, authController.getUserTableItem);
authRouter.post('/createUserImageUpload', authmiddleware, authController.createUserImageUpload);
authRouter.get('/getS3Config', authController.getS3Config);

module.exports = authRouter;