const mongoose = require("mongoose")
const { Service } = require("./service")
const { Employee } = require('./employee')

const FavoriteClient = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'Un client doît avoir un prénom'
    },
    lastName: {
        type: String,
        required: 'Un client doît avoir un nom'
    }
})

const ClientFavoriteSchema = new mongoose.Schema({
    client: {
        type: FavoriteClient,
        required: "L'attribut client du document ClientFavorite est obligatoire"
    },
    services: [{Service}],
    employees: [{Employee}]

})

module.exports = {
    ClientFavorite: mongoose.model('ClientFavorite', ClientFavoriteSchema)
}