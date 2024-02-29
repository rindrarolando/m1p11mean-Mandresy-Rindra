const Appointment = require('../models/appointment')
var ObjectID = require('mongoose').Types.ObjectId 

const getAppointmentsByEmployee = async(employeeId) => {
    try {
        let query = {
            'mapServiceEmployees': {
                $elemMatch: {
                    'employee._id': employeeId
                }
            }
        }

        const employeeAppointments = await Appointment.find(query);

        const matchingMapServiceEmployees = employeeAppointments.flatMap(appointment =>
            appointment.mapServiceEmployees
                .filter(mapServiceEmployee => mapServiceEmployee.employee._id.toString() === employeeId.toString())
                .map((employeeAppointment) => {
                    const serviceDurationInMinutes = employeeAppointment.service.duration || 0
                    const startDateTime = new Date(employeeAppointment.startDateTime)
                    const endDateTime = new Date(startDateTime.getTime() + serviceDurationInMinutes * 60000)

                    const plainObject = employeeAppointment.toObject()

                    // Delete the employee property
                    delete plainObject.employee;

                    return {
                        ...plainObject,
                        endDateTime
                    }
                })
        )

        return matchingMapServiceEmployees;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getEmployeeAppointmentHistory = async (userId, startDateTime, endDateTime) => {
    try {
        let query = {
            'mapServiceEmployees': {
                $elemMatch: {
                    'employee.user._id': userId
                }
            },
            startDateTime: { $gte: startDateTime }
        }

        if (endDateTime) {
            query.endDateTime = { $lte: endDateTime }
        }

        const employeeAppointments = await Appointment.find(query);

        const matchingMapServiceEmployees = employeeAppointments.flatMap(appointment =>
            appointment.mapServiceEmployees
                .filter(mapServiceEmployee => mapServiceEmployee.employee.user._id.toString() === userId.toString())
                .map((employeeAppointment) => {
                    const serviceDurationInMinutes = employeeAppointment.service.duration || 0;
                    const startDateTime = new Date(employeeAppointment.startDateTime);
                    const endDateTime = new Date(startDateTime.getTime() + serviceDurationInMinutes * 60000);

                    const plainObject = employeeAppointment.toObject();

                    // Delete the employee property
                    delete plainObject.employee;

                    return {
                        ...plainObject,
                        endDateTime
                    };
                })
        )

        return matchingMapServiceEmployees;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getDailyAppointmentsCount = async (month) => {
    const startOfMonth = new Date(Date.UTC(new Date().getFullYear(), month - 1, 1))
    const endOfMonth = new Date(Date.UTC(new Date().getFullYear(), month, 0, 23, 59, 59, 999))

    const result = await Appointment.aggregate([
        {
            $match: {
                startDateTime: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$startDateTime' } },
                count: { $sum: 1 }
            }
        }
    ])

    return result
}

const getClientAppointmentHistory = async (clientId, startDateTime, endDateTime) => {
    
    try {
        let query = {
            'client._id': clientId,
        }

        if (endDateTime) {
            query.startDateTime = {
                $gte: startDateTime,
                $lte: endDateTime,
            }
        } else {
            query.startDateTime = {
                $gte: startDateTime
            }
        }

        return await Appointment.find(query)
    } catch (error) {
        throw new Error(`Error fetching appointments: ${error.message}`)
    }
}

const markAppointmentAsDone = async (appointmentId) => {
    return await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { status: 'done' } },
        { new: true }
    )
}

const addAppointment = async data => { return await new Appointment(data).save() }

const getAppointments = async () => { return await Appointment.find({}) }

const getOneAppointment = async appointmentID => { return await Appointment.findById(appointmentID) }

const deleteAppointment = async appointmentID => { 
    var deleted = false
    await Appointment.findByIdAndRemove(appointmentID, function (err, docs) { if (err){ } else  deleted = true })
    return deleted
}

module.exports = {
    addAppointment,
    getAppointments,
    getOneAppointment,
    deleteAppointment,
    getClientAppointmentHistory,
    getEmployeeAppointmentHistory,
    markAppointmentAsDone,
    getDailyAppointmentsCount,
    getAppointmentsByEmployee
}