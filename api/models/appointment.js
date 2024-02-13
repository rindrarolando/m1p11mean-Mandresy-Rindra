const mongoose = require('mongoose')
const { EmployeeSchema } = require('./employee')
const { ServiceSchema } = require('./service')
const { UserSchema } = require('./user')

const Schema = new mongoose.Schema({
    employee: {
        type: EmployeeSchema,
        required: 'An appointment should be associated with an employee'
    },
    startDateTime: {
        type: Date,
        required: 'StartDateTime is required'
    },
    client: {
        type: UserSchema,
        required: 'Client attribute is required'
    }

}, {timestamps: true})

module.exports = mongoose.model('Appointments', Schema)