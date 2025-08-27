const patientController = require('../controllers/patient-controller');
const authMiddleware = require('../utility/authmiddleware');

const express = require('express');
const patientRouter = express.Router();
patientRouter.post('/createPatient', authMiddleware, patientController.createPatient);
patientRouter.get('/getAllPatients', authMiddleware, patientController.getAllPatients);
patientRouter.get('/getPatient/:id', authMiddleware, patientController.getPatient);
patientRouter.post('/createPatientVisit', authMiddleware, patientController.createPatientVisit);
patientRouter.post('/getPatientVisitList', authMiddleware, patientController.getPatientVisits);
patientRouter.post('/getSinglePatientVisit', patientController.getSinglePatientVisit);
patientRouter.post('/filterPatient', authMiddleware, patientController.filterPatient);
patientRouter.get('/getDoctorList', authMiddleware, patientController.getDoctorList);
patientRouter.post('/getChartNotes', authMiddleware, patientController.getChartNotes);
patientRouter.post('/createChartNote', authMiddleware, patientController.createChartNotes);

module.exports = patientRouter;