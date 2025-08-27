const { findByIdAndUpdate, findById, create, findByFieldname, find, findBytwoFieldname, findByFieldnameAndUpdate, filterbyThreeFields } = require("../utility/dbqueries");
const { createResponse } = require("../utility/response");

exports.createPatient = async (req, res) => {
    const patientReq = Object.assign({}, req.body);
    const patientId = req.body._id;
    if (patientId) {
        try {
            const updateBody = Object.assign({}, patientReq);
            delete updateBody._id;
            await findByIdAndUpdate('Patient', updateBody, patientId);
            const updated = await findById('Patient', patientId);
            return createResponse(res, 'success', 'Patient updated successfully', updated[0]);
        } catch (error) {
            return createResponse(res, 'error', error.errors ? error.errors : error);
        }
    } else {
        try {
            patientReq.userId = req.user._id;
            const patient = await create('Patient', patientReq);
            return createResponse(res, 'success', 'Patient created successfully', patient);
        } catch (error) {
            return createResponse(res, 'error', error.errors ? error.errors : error);
        }
    }
};

exports.getAllPatients = async (req, res) => {
    const loggedInUser = req.user;
    try {
        const patientList = await findByFieldname('Patient', 'userId', loggedInUser._id);
        return createResponse(res, 'success', 'Patients fetched', patientList.reverse());
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getPatient = async (req, res) => {
    const loggedInUser = req.user;
    try {
        const patient = await findBytwoFieldname('Patient', 'userId', loggedInUser._id, '_id', req.params.id);
        const patientVisits = await findByFieldname('PatientVisit', 'patientId', patient.reverse()[0]._id);
        const patientResponse = JSON.parse(JSON.stringify(patient))[0];
        patientResponse.visitInfo = JSON.parse(JSON.stringify(patientVisits));
        return createResponse(res, 'success', 'Patient fetched', patientResponse);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.createPatientVisit = async (req, res) => {
    try {
        const newObj = Object.assign({}, req.body);
        newObj.images = JSON.stringify(req.body.images);

        const existing = await findByFieldname('PatientVisit', 'visitId', newObj.visitId);
        let patientVisit;
        if (existing.length > 0) {
            patientVisit = await findByFieldnameAndUpdate('PatientVisit', newObj, 'visitId', newObj.visitId);
        } else {
            patientVisit = await create('PatientVisit', newObj);
        }
        return createResponse(res, 'success', 'Visit created successfully', patientVisit);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getPatientVisits = async (req, res) => {
    try {
        const visitList = await findByFieldname('PatientVisit', 'patientId', req.body.patientId);
        return createResponse(res, 'success', 'Data fetched', visitList);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getSinglePatientVisit = async (req, res) => {
    try {
        const visitList = await findByFieldname('PatientVisit', 'visitId', req.body.visitId);
        if (visitList.length > 0) {
            const userDetails = await findById('Patient', visitList[0].patientId);
            visitList[0]['patientName'] = userDetails[0]?.firstName + ' ' + userDetails[0]?.lastName;
            return createResponse(res, 'success', 'Data fetched', visitList[0]);
        } else {
            return createResponse(res, 'success', 'Data fetched', visitList[0]);
        }
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.filterPatient = async (req, res) => {
    const loggedInUser = req.user;
    try {
        const patientList = await filterbyThreeFields('Patient', 'firstName', req.body.text, 'lastName', req.body.text, 'patientId', req.body.text);
        const result = patientList.filter((patient) => {
            return patient.userId === loggedInUser._id;
        });
        return createResponse(res, 'success', 'Data fetched', result);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getDoctorList = async (req, res) => {
    try {
        const doctorList = await find('User');
        return createResponse(res, 'success', 'Data fetched', doctorList);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.getChartNotes = async (req, res) => {
    try {
        const chartNotes = await findByFieldname('ChartNote', 'patientId', req.body.patientId);
        return createResponse(res, 'success', 'Data fetched', chartNotes);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};

exports.createChartNotes = async (req, res) => {
    try {
        chartNote = await create('ChartNote', req.body);
        return createResponse(res, 'success', 'Added successfully', chartNote);
    } catch (error) {
        return createResponse(res, 'error', error.errors ? error.errors : error);
    }
};