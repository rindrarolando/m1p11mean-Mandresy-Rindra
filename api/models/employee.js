const { UserSchema } = require('./user')
const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    user: {
        type: UserSchema,
        required: 'An employee should have an user account'
    }
}, {timestamps: true})

module.exports = {
    Employee: mongoose.model('Employee', EmployeeSchema),
    EmployeeSchema
}