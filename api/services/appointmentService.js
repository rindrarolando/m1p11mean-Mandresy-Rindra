const Appointment = require('../models/appointment');
var ObjectID = require('mongoose').Types.ObjectId; 

const addAppointment = async data => { return await new Appointment(data).save() }

const getAppointments = async () => { return await Appointment.find({}) }

const getOneAppointment = async appointmentID => { return await Appointment.findById(appointmentID) }

const deleteAppointment = async appointmentID => { 
    var deleted = false
    await Appointment.findByIdAndRemove(appointmentID, function (err, docs) { if (err){ } else  deleted = true })
    return deleted;
}

module.exports = {
    addAppointment,
    getAppointments,
    getOneAppointment,
    deleteAppointment
}