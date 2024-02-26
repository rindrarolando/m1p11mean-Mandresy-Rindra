const mongoose = require("mongoose")
const ObjectID = require('mongoose').Types.ObjectId

const ClientFavoriteSchema = new mongoose.Schema({
    clientId: {
        type: ObjectID,
        ref: 'User',
        required: true
    },
    services: [],
    employees: []

})

module.exports = {
    ClientFavorite: mongoose.model('ClientFavorite', ClientFavoriteSchema)
}