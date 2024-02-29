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
        timezone: false,
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
        timezone: false,
        required: 'La date et heure de début du rendez-vous est nécessaire'
    },
    endDateTime: {
        type: Date,
        timezone: false,
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
    },
    discountPercentage: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
    }

})

module.exports = mongoose.model('Appointments', Schema)