const express = require('express')
const {check} = require('express-validator')
const AppointmentController = require('../controllers/appointmentController')
const validate = require('../middlewares/validate')
const router = express.Router()

router.get('/',  AppointmentController.getAppointments)

router.get('/:appointmentId', [
    check('appointmentId').not().isEmpty().withMessage('invalid url'),
    check('appointmentId').isLength({min: 24}).withMessage('invalid url')

], validate, AppointmentController.setAppointment, AppointmentController.authGetAppointment, AppointmentController.getOneAppointment)

router.post('/add', [
    check('name').not().isEmpty().withMessage('Appointment name cannot be null'),
    check('name').isLength({min: 7}).withMessage('Appointment name must at least 7 chars long'),

], validate, AppointmentController.authAddAppointment, AppointmentController.addNewAppointment)

router.delete('/:appointmentId', [
    check('appointmentId').not().isEmpty().withMessage('invalid url'),
    check('appointmentId').isLength({min: 24}).withMessage('invalid url')

], validate,  AppointmentController.setAppointment, AppointmentController.authDeleteAppointment, AppointmentController.removeAppointment)

module.exports = router