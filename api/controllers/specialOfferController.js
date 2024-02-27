const helper = require('../helpers/common')
const employeeService = require('../services/employeeService.js')
const serviceService = require('../services/serviceService.js')
const ObjectID = require('mongoose').Types.ObjectId
const userService = require('../services/userService.js')

const addSpecialOffer = async (req, res) => {
    try {
        
        helper.sendResponseMsg(res, 'Préference mis ajouté avec succès', true, 200)
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

module.exports = {
    addSpecialOffer
}