const helper = require('../helpers/common')
const employeeService = require('../services/employeeService.js')
const serviceService = require('../services/serviceService.js')
const ObjectID = require('mongoose').Types.ObjectId
const userService = require('../services/userService.js')
const favoriteService = require('../services/favoriteService.js')

const addFavorite = async (req, res) => {
    try {
        const reqData = req.body
        // if both of employeeId and serviceId are empty
        if(!reqData.employeeId && !reqData.serviceId)
            throw new Error('At least one of serviceId and employeeId should be filled')

        // if the client doesnt have a favorite record in the db
        let clientFavorite = await favoriteService.getClientFavorite(req.user._id)

        // if employeeId is not empty
        if(reqData.employeeId) {
            const employee = await employeeService.getOneEmployee(reqData.employeeId)
            await favoriteService.addClientFavoriteEmployee(clientFavorite._id, employee.toObject())
        }

        // if serviceId is not empty
        if(reqData.serviceId) {
            const service = await serviceService.getOneService(reqData.serviceId)
            await favoriteService.addClientFavoriteService(clientFavorite._id, service.toObject())
        }

        helper.sendResponseMsg(res, 'Préference mis ajouté avec succès', true, 200)
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

module.exports = {
    addFavorite
}