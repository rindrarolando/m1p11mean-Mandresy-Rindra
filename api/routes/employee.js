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
        check('user.password').not().isEmpty().isLength({min: 6}).withMessage("Le champ mot de passe doit contenir au moins 6 caractères."),
        check('serviceId').not().isEmpty().withMessage("Le champ service ne doit être vide"),
        check('nationalId').matches(/^\d{12}$/).withMessage("Le champ CIN doit être composé de 12 chiffres")
        
        ], validate , EmployeeController.addNewEmployee)
    .get([
        query('rowsPerPage').isInt({min: 1}),
        query('pageNumber').isInt({min: 1})
        
        ], EmployeeController.getEmployees)

router.route('/:id')
    .all(EmployeeController.setEmployee)
    .get(EmployeeController.getOneEmployee)
    .put(EmployeeController.updateEmployee)
    .delete(EmployeeController.removeEmployee)
    
module.exports = router