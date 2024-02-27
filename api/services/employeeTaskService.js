const { EmployeeTask } = require('../models/employeeTask.js')

const addTask = async (mapServiceEmployees) => {
    const employeeId = mapServiceEmployees.employee._id
    const service = mapServiceEmployees.service
    // commission amount = service amount * service commission
    const commissionAmount = service.price * (service.commission/100)
    const startDateTime = mapServiceEmployees.startDateTime
    // end date time = start date time plus duration minute
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000)

    return await new EmployeeTask({employeeId, service, commissionAmount, startDateTime, endDateTime}).save()
}

module.exports = {
    addTask
}