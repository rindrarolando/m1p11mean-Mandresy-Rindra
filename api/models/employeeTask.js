const mongoose = require('mongoose')
const ObjectID = require('mongoose').Types.ObjectId
const { ServiceSchema } = require('./service')

const Schema = new mongoose.Schema({  
    employeeId: {
        type: ObjectID,
        ref: 'Employee',
        required: true
    },
    service: {
        type: ServiceSchema,
        required: true
    },
    commissionAmount: {
        type: Number,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    }
})

module.exports = {
    EmployeeTask: mongoose.model('EmployeeTask', Schema),
    EmployeeTaskSchema: Schema
}