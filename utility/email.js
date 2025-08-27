const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const path = require('path');

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);                 
        }
        else {
            callback(null, html);
        }
    });
};

const smtpObj = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'betterdiagnostics@gmail.com',
        pass: 'xiumrzlogrtcjkwu'
    }
}

exports.sendHTMLMail = (sendTo, subject, apiKey) => {
    const smtpTransport = nodemailer.createTransport(smtpObj);
    readHTMLFile(path.join(__dirname, './keymail.html'), function(err, html) {
        if (err) {
           return;
        }
        var template = handlebars.compile(html);
        var replacements = {
            EMAIL: sendTo,
            APIKEY: apiKey

        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'Toothinsights <betterdiagnostics@gmail.com>',
            to: sendTo,
            subject: subject,
            html : htmlToSend
         };
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
            }
        });
    });
};

exports.sendPDFHTMLMail = (sendTo, subject, NAME, fileName, baseString) => {
    const smtpTransport = nodemailer.createTransport(smtpObj);
    readHTMLFile(path.join(__dirname, './pdfmail.html'), function(err, html) {
        if (err) {
           return;
        }
        var template = handlebars.compile(html);
        var replacements = {
            NAME
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'Toothinsights <betterdiagnostics@gmail.com>',
            to: sendTo,
            subject: subject,
            html : htmlToSend,
            attachments: [
                {   // encoded string as an attachment
                  filename: fileName,
                  content: baseString.split("base64,")[1],
                  encoding: 'base64'
                }
              ]
         };
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
            }
        });
    });
};

exports.sendMail = (sendTo, subject, text) => {
    const transporter = nodemailer.createTransport(smtpObj);

    var mailOptions = {
        from: 'Toothinsights <betterdiagnostics@gmail.com>',
        to: sendTo,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
        }
    });
};