const express = require('express')
const {check, query} = require('express-validator')
const validate = require('../middlewares/validate')
const EmployeeController = require('../controllers/employeeController')

const router = express.Router()

router.route('/')
    .post(
        [
            check('user.firstName').not().isEmpty().withMessage("Le champ prénom ne doit être vide"),
            check('user.lastName').not().isEmpty().withMessage("Le champ nom ne doit être vide"),
            check('user.email').isEmail().withMessage("Le champ email doit être un email valide"),
            check('user.gender').not().isEmpty().withMessage("Le champ sexe est obligatoire"),
            check('user.password').not().isEmpty().isLength({min: 6}).withMessage("Le champ mot de passe doit contenir au moins 6 caractères."),
            check('serviceId').not().isEmpty().withMessage("Le champ service ne doit être vide"),
            check('nationalId').matches(/^\d{12}$/).withMessage("Le champ CIN doit être composé de 12 chiffres"),
            check('workSchedule.startHour').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("L'heure de début doit suivre le format HH:mm"),
            check('workSchedule.endHour').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("L'heure de fin doit suivre le format HH:mm")
        ], 
        validate , EmployeeController.authAddEmployee, EmployeeController.addNewEmployee)
    .get([
        query('rowsPerPage').isInt({min: 1}),
        query('pageNumber').isInt({min: 1})
        
        ], EmployeeController.getEmployees)

router.route('/daily-task')
        .get(EmployeeController.authDailyTask, EmployeeController.getDailyTask)

router.route('/:id')
    .all(EmployeeController.setEmployee)
    .get(EmployeeController.getOneEmployee)
    .put(EmployeeController.updateEmployee)
    .delete(EmployeeController.removeEmployee)

router.route('/:id/image')
    .put(EmployeeController.uploadImage)
    .get(EmployeeController.downloadImage)
    
module.exports = router