const emailController = require('../controllers/email-controller');

const express = require('express');
const emailRouter = express.Router();
emailRouter.post('/sendPDF', emailController.sendPDFInEmail);

module.exports = emailRouter;