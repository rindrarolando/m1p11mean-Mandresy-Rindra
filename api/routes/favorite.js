const express = require('express')
const {check, query} = require('express-validator')
const FavoriteController = require('../controllers/favoriteController.js')
const validate = require('../middlewares/validate')
const router = express.Router()
const helper = require('../helpers/common');

router.route('/')
    .post(FavoriteController.addFavorite)

module.exports = router