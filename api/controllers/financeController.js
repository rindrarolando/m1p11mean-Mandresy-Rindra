const financeService = require('../services/financeService.js')
const helper = require('../helpers/common')

const getMonthlyRevenue = async (req, res) => {
    try {
        const { year } = req.query
        const monthlyRevenue = await financeService.calculateMonthlyRevenue(year)
        return helper.sendResponse(res, monthlyRevenue)
    } catch (err) {
        helper.prettyLog(`catching ${err}`)
        helper.log2File(err.message,'error')
        return helper.sendResponse(res, 500, {message:err.message, success:false})
    }
}

const calculateBenefit = async (req, res) => {
    const { year, month, expenses } = req.body
    
    try {
        const benefitAmount = await financeService.calculateBenefit(year, month, expenses)
        return helper.sendResponse(res, {amount: benefitAmount})
    } catch (err) {
        helper.prettyLog(`catching ${err}`)
        helper.log2File(err.message,'error')
        return helper.sendResponse(res, 500, {message:err.message, success:false})
    }
}

const getDailyRevenue = async (req, res) => {
    try {
        const { year, month } = req.query
        const dailyRevenues = await financeService.calculateDailyRevenue(year, month)
        helper.sendResponse(res, dailyRevenues);
    } catch (error) {
        helper.prettyLog(`catching ${err}`)
        helper.log2File(err.message,'error')
        return helper.sendResponse(res, 500, {message:err.message, success:false})
    }
}

module.exports = {
    calculateBenefit,
    getDailyRevenue,
    getMonthlyRevenue
}