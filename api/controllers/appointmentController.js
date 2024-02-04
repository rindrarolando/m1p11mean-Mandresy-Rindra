const userService = require('../services/userService');
const helper = require('../helpers/common')
const appointmentService = require('../services/appointmentService')
const { canViewAppointment, canAddAppointment, canDeleteAppointment, scopedAppointments } = require('../rbac/permissions')
const ObjectID = require('mongoose').Types.ObjectId; 

const getOneAppointment = (req, res) => {

    return helper.sendResponse(res, {success:true, appointment:req.appointment})

}

const getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAppointments()

        return helper.sendResponse(res, {success:true, appointments:scopedAppointments(req.user, appointments)})

    } catch (e) {
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const addNewAppointment = async (req, res) => {
    try{
        const data = { name } = req.body

        const createdBy = new ObjectID(req.user.id)

        Object.assign(data, {createdBy})

        await appointmentService.addAppointment(data)

        return helper.sendResponseMsg(res, 'Appointment successfully created', true, 200 )
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}   
const removeAppointment = async (req, res) => {
    try{
        const deleted = await appointmentService.deleteAppointment(req.params.appointmentId)
        
        return helper.sendResponseMsg(res, `${deleted ? 'Appointment successfully deleted':'Appointment not found'}`, true, 200 )
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}   



async function setAppointment(req, res, next){
    const appointmentId = req.params.appointmentId
    req.appointment = await appointmentService.getOneAppointment(appointmentId)
    
    if (req.appointment == null)
        return helper.sendResponseMsg(res, 'Appointment not found', false, 404)
    
    next()
}

function authGetAppointment(req, res, next) {
    if(!canViewAppointment(req.user, req.appointment))
        return helper.sendResponseMsg(res, 'Not Allowed', false, 401)

    next()
}

function authAddAppointment(req, res, next){
    if(!canAddAppointment(req.user))
        return helper.sendResponseMsg(res, 'Not Allowed', false, 401)

    next()
}

function authDeleteAppointment(req, res, next){
    if(!canDeleteAppointment(req.user, req.appointment))
        return helper.sendResponseMsg(res, 'Not Allowed', false, 401) 

    next()
}
module.exports = { 
    setAppointment,
    authGetAppointment,
    authAddAppointment,
    authDeleteAppointment,
    getOneAppointment,
    getAppointments,
    addNewAppointment,
    removeAppointment,
    
}