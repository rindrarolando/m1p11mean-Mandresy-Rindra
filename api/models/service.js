const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    effectiveStartDate: {
        type: Date,
        required: true,
        default: Date.now
    },    
    effectiveEndDate: {
        type: Date,
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

}, {timestamps: true});

module.exports = mongoose.model('Service', Schema)