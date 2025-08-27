var CryptoJS = require("crypto-js");

exports.createResponse = (res, type, message, data = null) => {
    let response;
    let statusCode;
    switch (type) {
        case 'success':
            response = {
                status: 'success',
                statusCode: 200,
                message,
                data
            };
            statusCode = 200;
            break;
        case 'error':
            response = {
                status: 'error',
                statusCode: 400,
                error: message
            };
            statusCode = 400;
            break;
        case 'badrequest':
            response = {
                status: 'failed',
                statusCode: 500,
                error: message
            };
            statusCode = 500;
        default:
            break;
    }


    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), '123123abc57689').toString();
    return res.status(statusCode).json(ciphertext);
};