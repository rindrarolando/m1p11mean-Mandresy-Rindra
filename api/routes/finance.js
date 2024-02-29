const express = require('express')
const router = express.Router()
const FinanceController = require('../controllers/financeController.js')

router.get('/monthly-revenue', FinanceController.getMonthlyRevenue)
router.get('/daily-revenue', FinanceController.getDailyRevenue)
router.post('/calculate-benefit', FinanceController.calculateBenefit)

module.exports = router
