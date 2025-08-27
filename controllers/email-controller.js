const formidable = require("formidable");
const { createResponse } = require("../utility/response");
const fs = require('fs');
const { sendPDFHTMLMail } = require("../utility/email");

exports.sendPDFInEmail = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        [fields, files] = await form.parse(req);
        let pdf = fields.pdfFile[0];
        sendPDFHTMLMail(fields.email, 'Toothinsights dental report', fields.userName[0],fields.fileName[0], pdf)
        return createResponse(res, 'success', 'Mail Sent successfully', null);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};