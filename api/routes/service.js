const express = require('express')
const {check} = require('express-validator')
const ServiceController = require('../controllers/serviceController')
const validate = require('../middlewares/validate')
const router = express.Router()

router.route('/')
    .get(ServiceController.getServices)
    .post([
        check('name').not().isEmpty().withMessage("Le nom du service  ne peut être vide")

    ], validate, ServiceController.addNewService)

router.route('/:id')
    .all(ServiceController.setService)
    .get(ServiceController.getOneService)
    .put(ServiceController.updateService)
    .delete(ServiceController.removeService)

module.exports = router