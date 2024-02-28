const helper = require('../helpers/common')
const ObjectID = require('mongoose').Types.ObjectId
const specialOfferService = require('../services/specialOfferService.js')

const addSpecialOffer = async (req, res) => {
    try {
        // insert special offer into database
        const reqData = {
            ...req.body,
            serviceIds: req.body.serviceIds.map(id => new ObjectID(id))
        }
        const specialOffer = await specialOfferService.addSpecialOffer(reqData)

        helper.sendResponseMsg(res, specialOffer, true, 201)
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const setSpecialOffer = async (req, res, next) => {
    try {
        const specialOfferCode = req.params.code

        const specialOffer = await specialOfferService.findSpecialOfferByCode(specialOfferCode)

        if (specialOffer) {
            req.specialOffer = specialOffer
            next()
        } else {
            return helper.sendResponseMsg(res, 'Offre spéciale non trouvé', false, 404)   
        }
    } catch (e) {
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const getSpecialOffer = async (req, res) => {
    return helper.sendResponse(res, req.specialOffer)
}

module.exports = {
    addSpecialOffer,
    setSpecialOffer,
    getSpecialOffer
}