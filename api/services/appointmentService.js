const Appointment = require('../models/appointment')
var ObjectID = require('mongoose').Types.ObjectId 

const getEmployeeAppointmentHistory = async (userId, startDateTime, endDateTime) => {
    try {
        let query = {
            'mapServiceEmployees': {
                $elemMatch: {
                    'employee.user._id': userId
                }
            },
            startDateTime: { $gte: startDateTime }
        };

        if (endDateTime) {
            query.endDateTime = { $lte: endDateTime };
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
        );

        return matchingMapServiceEmployees;
    } catch (error) {
        console.error('Error fetching employee appointment history:', error);
        throw error;
    }
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
    getEmployeeAppointmentHistory
}