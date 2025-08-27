const { encrypt, compare } = require("../utility/bcrypt");
const { createResponse } = require("../utility/response");
var jwt = require('jsonwebtoken');
const { sendMail, sendHTMLMail } = require("../utility/email");
const { create, findByFieldname, findByIdAndUpdate, findById, find, findOneAndDelete, findBytwoFieldname, findByIdAndDelete, findByFieldnameAndUpdate } = require("../utility/dbqueries");
const { default: axios, all } = require("axios");
var async = require('async');

exports.testApi = (req, res) => {
    return res.status(200).json({ message: 'Working fine!' });
};

exports.createUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return createResponse(res, 'error', 'Provide email and password both');
    }
    try {
        const checkUserExist = await findByFieldname('User', 'email', req.body.email);
        if (checkUserExist.length > 0) {
            return createResponse(res, 'error', 'User with given email already exists', null);
        }
        const apiKey = await axios.post('https://0f5nhfzx51.execute-api.ap-south-1.amazonaws.com/default/Generate_API_Keys', {
            email: req.body.email
        });
        const user = await create('User', {
            email: req.body.email,
            password: encrypt(req.body.password),
            userName: req.body.username ? req.body.username : null,
            apiKey: apiKey.data.value,
            keyName: apiKey.data.name,
            keyExpiry: apiKey.data.expiry,
            licenseExpiry: req.body.licenseExpiry
        });
        sendHTMLMail(req.body.email, 'Welcome to Better Diagnostics!!', apiKey.data.value);
        return createResponse(res, 'success', 'User created successfully', { ...user, apiKey: apiKey.data });
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.login = async (req, res) => {
    
    if (!req.body.email || !req.body.password) {
        return createResponse(res, 'error', 'Provide email and password both');
    }
    const user = await findByFieldname('User', 'email', req.body.email);
    if (user.length === 0) {
        return createResponse(res, 'success', `User doesn't exist`);
    }
    const validPassword = compare(req.body.password, user[0].password);
    if (validPassword) {
        if (user[0].token) {
            await findByIdAndUpdate('User', {
                token: null
            }, user[0]._id);
        }
        const userWithNoToken = await findById('User', user[0]._id);
        const token = jwt.sign({
            data: JSON.stringify(userWithNoToken[0])
        }, 'tokenveryverysecretkey');
        await findByIdAndUpdate('User', {
            token: token
        }, userWithNoToken[0]._id);
        const responseUser = await findById('User', user[0]._id);
        return createResponse(res, 'success', 'Login success', responseUser[0]);
    } else {
        return createResponse(res, 'success', `Invalid password`);
    }
};

exports.createSubscription = async (req, res) => {
    if (!req.body.email) {
        return createResponse(res, 'error', 'Email is required');
    }
    try {
        await create('Subscriber', req.body);
        const response = await findByFieldname('Subscriber', 'email', req.body.email);
        sendMail('betterdiagnostics@gmail.com', 'You have a new Subscriber', req.body.email + ' subscribed to receive notifications.');
        return createResponse(res, 'success', 'Subscribed successfully', response.reverse()[0]);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.listSubscriptions = async (req, res) => {
    try {
        // const subscriberList = await Subscriber.find();
        const subscriberList = await find('Subscriber');
        return createResponse(res, 'success', 'Subscriptions fetched', subscriberList.reverse());
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.sendOtp = async (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        const otpExist = await findByFieldname('OTP', 'email', email);
        if (otpExist.length === 0) {
            await findOneAndDelete('OTP', 'email', email);
        }
        await create('OTP', { email, otp });
        sendMail(email, 'OTP for resetting password', 'Your OTP is ' + otp);
        return createResponse(res, 'success', 'Otp Sent', email);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.validateOTP = async (req, res) => {
    try {
        const otpExist = await findBytwoFieldname('OTP', 'email', req.body.email, 'otp', req.body.otp);
        if (otpExist.length > 0) {
            const resOTP = Object.assign({}, otpExist[0]);
            await findByIdAndDelete('OTP', otpExist.reverse()[0]._id);
            return createResponse(res, 'success', 'Otp Verified', resOTP.email);
        } else {
            return createResponse(res, 'success', 'Otp Invalid', null);
        }
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const updatePassword = req.body.password;
        await findByFieldnameAndUpdate('User', {
            password: encrypt(updatePassword)
        }, 'email', email);
        return createResponse(res, 'success', 'Password Changed', req.body.email);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.validateEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await findByFieldname('User', 'email', email);
        if (user.length > 0) {
            return createResponse(res, 'success', 'Found', user[0].email);
        } else {
            return createResponse(res, 'success', 'Not Found', null);
        }
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userProfile = await findByFieldname('UserProfile', 'userId', req.body.userId);
        const userData = await findById('User', req.body.userId);
        const user = [{ ...userProfile[0] }];
        user[0].opgLimit = userData[0].opgLimit;
        user[0].rvgLimit = userData[0].rvgLimit;

        let opgCount = 0;
        let rvgCount = 0;

        const allUserImages = await findByFieldname('UserImageUpload', 'userId', req.body.userId);
        allUserImages.forEach((item) => {
            if(item.imageType === 'RVG') {
                rvgCount = rvgCount + parseInt(item.imageCount)
            }
            if(item.imageType === 'OPG') {
                opgCount = opgCount + parseInt(item.imageCount)
            }
        })

        user[0]['opgCount'] = opgCount;
        user[0]['rvgCount'] = rvgCount;
        user[0]['licenseExpiry'] = userData[0].licenseExpiry;
        user[0]['userCreatedAt'] = userData[0].createdAt;

        return createResponse(res, 'success', 'Data fetched', user);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

getVisitsOfAllPatients = (allPatients) => {
    return new Promise((resolve, reject) => {
        let allVisitsofAllPatients = [];

        async.forEachOf(allPatients, async (data, callback) => {
            const patientVisits = await findByFieldname('PatientVisit', 'patientId', data._id);
            patientVisits.forEach((item) => {
                allVisitsofAllPatients.push(item);
            });
            // console.log(patientVisits);
            callback();
        }, (err, results) => {
            return resolve(allVisitsofAllPatients);
        });
    });
};

exports.createUserProfile = async (req, res) => {
    const userProfileReq = Object.assign({}, req.body);
    const profileID = req.body._id;
    if (profileID) {
        try {
            const updateBody = Object.assign({}, userProfileReq);
            delete updateBody._id;
            await findByIdAndUpdate('UserProfile', updateBody, profileID);
            const updated = await findById('UserProfile', profileID);
            return createResponse(res, 'success', 'UserProfile updated successfully', updated[0]);
        } catch (error) {
            return createResponse(res, 'error', error.errors ? error.errors : error);
        }
    } else {
        try {
            const UserProfile = await create('UserProfile', userProfileReq);
            return createResponse(res, 'success', 'UserProfile created successfully', UserProfile);
        } catch (error) {
            return createResponse(res, 'error', error.errors ? error.errors : error);
        }
    }
};

exports.getUserTableItem = async (req, res) => {
    try {
        const userProfile = await findById('User', req.body.userId);
        return createResponse(res, 'success', 'Data fetched', userProfile);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.updateImageLimit = async (req, res) => {
    try {
        const { userId, opgLimit, rvgLimit, token, email, licenseExpiry } = req.body;
        if (token && token === 'sdajh78yasdg' && email === 'sm892356@gmail.com') {
            const updateBody = {
                opgLimit,
                rvgLimit,
                licenseExpiry
            };
            await findByIdAndUpdate('User', updateBody, userId);
            const updated = await findById('User', userId);
            return createResponse(res, 'success', 'User data updated successfully', updated[0]);
        } else {
            return createResponse(res, 'You are not authorized to perform this action');
        }
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.createUserImageUpload = async (req, res) => {
    try {
        const request = req.body;
        request.userId = req.user._id;
        const data = await create('UserImageUpload', request);
        return createResponse(res, 'success', 'Created successfully', data);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};


exports.getS3Config = async (req, res) => {
    try {
        const data = await find('S3Config');
        return createResponse(res, 'success', 'S3 Config List', data[0]);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

