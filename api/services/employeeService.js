const { Employee } = require('../models/employee')
const mongoose = require('mongoose')
const userService = require('./userService')

const addEmployee = async data => { 
    let session = null;
    try {
        await Employee.createCollection()

        session = await mongoose.startSession()
        session.startTransaction()

        const newUser = await userService.addUser(data.user)
        data.user = newUser
        console.log("Insert User successfully", data.user)

        const newEmployee = await new Employee(data).save()
        console.log("Insert Employee successfully", newEmployee);

        await session.commitTransaction()
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

const getEmployees = async (options) => { 
    return await Employee.paginate({}, options)
}

const getOneEmployee = async employeeID => { return await Employee.findById(employeeID) }

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
    deleteEmployee
}