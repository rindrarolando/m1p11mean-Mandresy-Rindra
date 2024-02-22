const express = require('express')
const {check, query} = require('express-validator')
const ServiceController = require('../controllers/serviceController')
const validate = require('../middlewares/validate')
const upload = require('../config/upload')
const router = express.Router()
const helper = require('../helpers/common');

router.route('/')
    .get([
        query('rowsPerPage').isInt({min: 1}),
        query('pageNumber').isInt({min: 1})
        
        ], ServiceController.getServices)
    .post(
        upload.single('serviceFile'), function (req, res, next) {
            if(req.error)
                helper.sendResponse(res, 500, {message:err.message, success:false})
            helper.sendResponseMsg(res, "Service créer avec succès", true, 200)
        }
        // [
        // check('name').not().isEmpty().withMessage("Le nom du service  ne peut être vide")
        // ], validate, ServiceController.authAddService, ServiceController.addNewService
        )

router.route('/:id')
    .all(ServiceController.setService)
    .get(ServiceController.getOneService)
    .put(ServiceController.authUpdateService, ServiceController.updateService)
    .delete(ServiceController.authUpdateService, ServiceController.removeService)

module.exports = router