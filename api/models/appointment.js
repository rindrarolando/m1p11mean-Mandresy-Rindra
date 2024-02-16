const mongoose = require('mongoose')
const { EmployeeSchema } = require('./employee')
const { ServiceSchema } = require('./service')
const { UserSchema } = require('./user')

const Schema = new mongoose.Schema({
    employee: [{
        type: EmployeeSchema,
        required: 'Un rendez-vous doit avoir aux moins un employee'
    }],
    startDateTime: {
        type: Date,
        required: 'La date et heure de début du rendez-vous est nécessaire'
    },
    endDateTime: {
        type: Date,
        required: 'La date et heure de fin du rendez-vous est nécessaire'
    },
    client: {
        type: UserSchema,
        required: 'Un rendez-vous doit avoir un client'
    },
    status: {
        type: String,
        enum: ['booked', 'done'],
        default: 'booked'
    }

}, {timestamps: true})

module.exports = mongoose.model('Appointments', Schema)