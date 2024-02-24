const express = require('express')
const {check} = require('express-validator')
const AppointmentController = require('../controllers/appointmentController')
const validate = require('../middlewares/validate')
const router = express.Router()

router.route('/')
    .post(
        [
            check('startDateTime').matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).withMessage("Le champ date et heure doit suivre le format yyyy-MM-ddTHH:mm"),
            check('mapServiceEmployees').isArray({min: 1}).withMessage("Le rendez-vous doit avoir au moins une service et un employé")
        ],
        validate, AppointmentController.authAddAppointment, AppointmentController.addNewAppointment)
    .get(AppointmentController.getAppointments)

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