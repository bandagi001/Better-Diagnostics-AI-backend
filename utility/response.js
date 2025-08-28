var CryptoJS = require("crypto-js");

exports.createResponse = (res, type, message, data = null) => {
    let response;
    let statusCode;
    let payloadToEncrypt;
    switch (type) {
        case 'success':
            response = {
                status: 'success',
                statusCode: 200,
                message,
                data
            };
            statusCode = 200;
            // Preserve existing behavior for success: encrypt only data payload
            payloadToEncrypt = data;
            break;
        case 'error':
            response = {
                status: 'error',
                statusCode: 400,
                error: message
            };
            statusCode = 400;
            // For errors, include full response so clients can see error details
            payloadToEncrypt = response;
            break;
        case 'badrequest':
            response = {
                status: 'failed',
                statusCode: 500,
                error: message
            };
            statusCode = 500;
            payloadToEncrypt = response;
            break;
        default:
            response = {
                status: 'error',
                statusCode: 400,
                error: 'Unknown response type'
            };
            statusCode = 400;
            payloadToEncrypt = response;
            break;
    }

    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payloadToEncrypt), '123123abc57689').toString();
    return res.status(statusCode).json(ciphertext);
};