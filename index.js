const express = require('express');
const cors = require('cors');
const path = require('path');
var bodyParser = require('body-parser');

const authRouter = require('./routes/auth-routes');
const patientRouter = require('./routes/patient-routes');
const emailRouter = require('./routes/email-routes');
const decryptRequest = require('./middlewares/decryptreq');
const PORT = 4000;

const app = express();
const router = express.Router();

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(decryptRequest);
app.use('/api/v1', router);
router.use('/auth', authRouter);
router.use('/patient', patientRouter);
router.use('/email', emailRouter);

app.listen(PORT, () => {
    console.log('App running on port -> ' + PORT);
})