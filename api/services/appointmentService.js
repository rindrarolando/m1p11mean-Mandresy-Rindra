const Appointment = require('../models/appointment')
var ObjectID = require('mongoose').Types.ObjectId 

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
    getClientAppointmentHistory
}