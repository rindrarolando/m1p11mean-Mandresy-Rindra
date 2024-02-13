const mongoose = require('mongoose')
const { ServiceSchema } = require('./service')
const mongoosePaginate = require('mongoose-paginate-v2')

const EmployeeSchema = new mongoose.Schema({
    user: {
        type: {},
        required: 'An employee should have an user account'
    },
    service: {
        type: ServiceSchema,
        required: 'An employee should be associated to at least one service'
    },
    nationalId: {
        type: String,
        required: true,
        unique: 'Every employee should have a national identifier'
    }
}, {timestamps: true})

EmployeeSchema.plugin(mongoosePaginate)

module.exports = {
    Employee: mongoose.model('Employee', EmployeeSchema),
    EmployeeSchema
}