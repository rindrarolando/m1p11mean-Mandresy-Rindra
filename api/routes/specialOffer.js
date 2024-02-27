const express = require('express')
const {check, query} = require('express-validator')
const SpecialOfferController = require('../controllers/specialOfferController.js')
const validate = require('../middlewares/validate')
const router = express.Router()
const helper = require('../helpers/common')

router.route('/')
    .post(SpecialOfferController.addSpecialOffer)

module.exports = router