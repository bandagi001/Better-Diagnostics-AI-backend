var CryptoJS = require("crypto-js");

module.exports = function (req, res, next) {
    const encrypted = req.body.data;

    if (encrypted) {
        // console.log(encrypted)
        var bytes = CryptoJS.AES.decrypt(encrypted, '123123abc57689');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        req.body = decryptedData;
    }
    next();
};