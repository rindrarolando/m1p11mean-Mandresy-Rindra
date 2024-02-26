const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = new mongoose.Schema({
    effectiveStartDate: {
        type: Date,
        timezone: false,
        required: true,
        default: Date.now
    },    
    effectiveEndDate: {
        type: Date,
        timezone: false,
        required: false
    },    
    name: {
        type: String,
        required: 'Service name is required'
    },
    price: {
        type: Number,
        required: 'Service price is required'
    },
    duration: {
        type: Number,
        required: 'Service duration is required'
    },
    commission: {
        type: Number,
        required: 'Service commission is required'
    },
    employees: []
})

Schema.plugin(mongoosePaginate)

module.exports = {
    Service: mongoose.model('Service', Schema),
    ServiceSchema: Schema
}