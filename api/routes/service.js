const express = require('express')
const {check, query} = require('express-validator')
const ServiceController = require('../controllers/serviceController')
const validate = require('../middlewares/validate')
const router = express.Router()

router.route('/')
    .get([
        query('rowsPerPage').isInt({min: 1}),
        query('pageNumber').isInt({min: 1})
        
        ], ServiceController.getServices)
    .post([
        check('name').not().isEmpty().withMessage("Le nom du service  ne peut être vide")
        
    ], validate, ServiceController.authAddService, ServiceController.addNewService)

router.route('/:id')
    .all(ServiceController.setService)
    .get(ServiceController.getOneService)
    .put(ServiceController.authUpdateService, ServiceController.updateService)
    .delete(ServiceController.authUpdateService, ServiceController.removeService)

module.exports = router