const { ClientFavorite } = require("../models/clientFavorite")
const ObjectID = require('mongoose').Types.ObjectId

const getClientFavorite = async (clientId) => {
    clientId = new ObjectID(clientId)

    // find client favorite record and return it if it exist
    const clientFavorite = await ClientFavorite.find({'clientId': clientId}).exec()
    if(clientFavorite.length !== 0) 
        return clientFavorite[0]
    
    return await new ClientFavorite({
        'clientId': clientId,
        'services': [],
        'employees': []
    }).save()
}

const addClientFavoriteEmployee = async (favoriteId, employee) => {
    return await ClientFavorite.findByIdAndUpdate(favoriteId, { $push: { employees: employee } }, {new: true})
}

const addClientFavoriteService = async (favoriteId, service) => {
    return await ClientFavorite.findByIdAndUpdate(favoriteId, { $push: { services: service } }, {new: true})
}

module.exports = {
    getClientFavorite,
    addClientFavoriteEmployee,
    addClientFavoriteService
}