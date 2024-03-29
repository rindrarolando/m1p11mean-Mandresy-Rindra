const { Employee } = require('../models/employee')
const mongoose = require('mongoose')
const userService = require('./userService')
const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const { Service } = require('../models/service')
const ObjectID = require('mongoose').Types.ObjectId
const appointmentService = require('../services/appointmentService')

const hiddedField =  ['-user.password' ]

const isEmployeeBusyDuringTimeRange = async (employeeId, startDateTime, endDateTime) => {
    const existingAppointments = await appointmentService.getAppointmentsByEmployee(employeeId)

    for (const appointment of existingAppointments) {
        const appointmentStart = appointment.startDateTime
        const appointmentEnd = appointment.endDateTime

        // Check if there is an overlap in time range
        if ((startDateTime >= appointmentStart && startDateTime < appointmentEnd) ||
            (endDateTime > appointmentStart && endDateTime <= appointmentEnd) ||
            (startDateTime <= appointmentStart && endDateTime >= appointmentEnd)) {
            return true // Employee is busy during the specified time range
        }
    }

    return false // Employee is available
}

const addEmployee = async data => { 
    
    const session = await mongoose.connection.startSession()
    try {

        session.startTransaction()

        // hash employee password
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err)
    
            bcrypt.hash(data.user.password, salt, function(err, hash) {
                if (err) return next(err)
    
                data.user.password = hash
            })
        })

        // create employee user account
        const userResults = await User.create([data.user], { session })
        const newUser = userResults[0]
        data.user = newUser

        // insert the employee document
        const employeeRes = await Employee.create([data], { session })
        const newEmployee = employeeRes[0]

        // add the new employee to the list of the employees his/her Sevice(model)
        let service = await Service.findById(newEmployee.service._id)
        await Service.findByIdAndUpdate(service._id, 
            {$push: {
                employees: { _id: newEmployee._id, 
                    firstName: newUser.firstName, 
                    lastName: newUser.lastName 
                }
            }}, 
            { session })

        await session.commitTransaction()
        session.endSession()
        
        return newEmployee
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const getEmployees = async (options) => { 
    return await Employee.paginate({}, options)
}

const getOneEmployee = async employeeID => { return await Employee.findById(employeeID).select(hiddedField) }

const findByUserId = async userid => { return await Employee.findOne({'user._id': userid}) }

const updateEmployee = async (id, update,select) => {
    return await Employee.findOneAndUpdate({_id: id}, update, {
        new: true
    }).select(select)
}

const deleteEmployee = async employeeID => { 
    await Employee.findByIdAndDelete(employeeID)
}

module.exports = {
    addEmployee,
    getEmployees,
    getOneEmployee,
    updateEmployee,
    deleteEmployee,
    findByUserId,
    isEmployeeBusyDuringTimeRange
}