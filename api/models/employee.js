const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EmployeeService = new mongoose.Schema({
    name: {
        type: String,
        required: 'Employee service\'s name is reqiured'
    }
})
const EmployeeWorkSchedule = new mongoose.Schema({
    startHour: {
        type: String,
        required: 'An employee work schedule should have a start hour',
        match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Start hour format should be HH:mm"]
    },
    endHour: {
        type: String,
        required: 'An employee work schedule should have a end hour',
        match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "End hour format should be HH:mm"]
    }
})
const EmployeeSchema = new mongoose.Schema({
    user: {
        type: {},
        required: 'An employee should have an user account'
    },
    service: {
        type: EmployeeService,
        required: 'An employee should be associated to at least one service'
    },
    nationalId: {
        type: String,
        required: true,
        unique: 'Every employee should have a national identifier'
    },
    workSchedule: {
        type: EmployeeWorkSchedule,
        required: 'An employee should have an work schedule'
    }
})

EmployeeSchema.plugin(mongoosePaginate)

module.exports = {
    Employee: mongoose.model('Employee', EmployeeSchema),
    EmployeeSchema
}