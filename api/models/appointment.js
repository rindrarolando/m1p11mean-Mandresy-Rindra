const mongoose = require('mongoose')
const { EmployeeSchema } = require('./employee')
const { ServiceSchema } = require('./service')
const { UserSchema } = require('./user')

const MapServiceEmployeeSchema = new mongoose.Schema({
    employee: {
        type: EmployeeSchema,
        required: 'Un rendez-vous doit avoir aux moins un employee'
    },
    service: {
        type: ServiceSchema,
        required: 'Un rendez-vous doit avoir une service'
    },
    startDateTime: {
        type: Date,
        required: 'Un map de service employé dans un rendez-vous doit avoir un date et heure de début'
    }
})

const Schema = new mongoose.Schema({
    mapServiceEmployees: [{
        type: MapServiceEmployeeSchema,
        required: 'Un rendez-vous doit avoir au moins une service et un employé'
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
    },
    price: {
        type: Number,
        required: 'Le prix des services du rendez-vous est nécessaire.'
    }

}, {timestamps: true})

module.exports = mongoose.model('Appointments', Schema)