const express = require('express')
const {check, query} = require('express-validator')
const AppointmentController = require('../controllers/appointmentController')
const validate = require('../middlewares/validate')
const router = express.Router()

router.route('/history')
    .get(
        [
            query('startDateTime').matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).withMessage("Le champ date et heure de debut doit suivre le format yyyy-MM-ddTHH:mm")
        ],
        AppointmentController.authViewAppointmentHistory, AppointmentController.getAppointmentHistory
    )

router.route('/')
    .post(
        [
            check('startDateTime').matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).withMessage("Le champ date et heure doit suivre le format yyyy-MM-ddTHH:mm"),
            check('mapServiceEmployees').isArray({min: 1}).withMessage("Le rendez-vous doit avoir au moins une service et un employé")
        ],
        validate, AppointmentController.authAddAppointment, AppointmentController.addNewAppointment)
    .get(AppointmentController.getAppointments)

router.get('/daily-appointments/:month', AppointmentController.getDailyAppointmentsCount)

router.route('/:id')
    .put(AppointmentController.setAppointment, AppointmentController.authMarkAppointmentAsDone, AppointmentController.markAppointmentAsDone)

router.delete('/:appointmentId', [
    check('appointmentId').not().isEmpty().withMessage('invalid url'),
    check('appointmentId').isLength({min: 24}).withMessage('invalid url')

], validate,  AppointmentController.setAppointment, AppointmentController.authDeleteAppointment, AppointmentController.removeAppointment)

module.exports = router