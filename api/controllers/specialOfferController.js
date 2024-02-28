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
        console.log(e);
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

module.exports = {
    addSpecialOffer
}