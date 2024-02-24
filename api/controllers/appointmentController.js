const helper = require('../helpers/common')
const appointmentService = require('../services/appointmentService')
const { canViewAppointment, canAddAppointment, canDeleteAppointment, scopedAppointments } = require('../rbac/permissions')
const ObjectID = require('mongoose').Types.ObjectId
const serviceService = require('../services/serviceService')
const employeeService = require('../services/employeeService.js')

const addNewAppointment = async (req, res) => {
    try{
        // retrieve the data from the http client
        let reqData = req.body
        const client = res.user
        reqData.startDateTime = new Date(reqData.startDateTime)
        let mapServiceEmployees = []
        let nextServiceStartDateTime = reqData.startDateTime
        let lastServiceDuration = 0
        let price = 0

        // verify if the data from the http client are legit
        for(let i = 0; i < reqData.mapServiceEmployees.length; i++) {
            // does the service exist in the db?
            let service = await serviceService.getOneService(reqData.mapServiceEmployees[i].serviceId)
            if(!service)
                throw new Error(`Aucune service n'a ${ reqData.mapServiceEmployees[i].serviceId } comme ID`)
            price += service.price

            // does the employee exist in the db ?
            let employee = await employeeService.getOneEmployee(reqData.mapServiceEmployees[i].employeeId)
            if(!employee)
                throw new Error(`Aucun employé n'a ${ reqData.mapServiceEmployees[i].employeeId } comme ID`)
            // TODO: verify if the employee doesn't have something else to do
            
            // push it, push it! 
            mapServiceEmployees.push({employee, service, startDateTime: nextServiceStartDateTime})

            // the next service start date time = this service start date time + this service's duration
            nextServiceStartDateTime = new Date(nextServiceStartDateTime.getTime() + service.duration*60000)
            lastServiceDuration = service.duration
        }
        // ora, calcolare la data di fine dell'appuntamento
        let appointmentEndDateTime = new Date(nextServiceStartDateTime.getTime() + lastServiceDuration)
        reqData.endDateTime = appointmentEndDateTime
        
        reqData.status = 'booked'
        reqData.mapServiceEmployees = mapServiceEmployees
        reqData.price = price

        // the authenticated user is the client
        reqData.client = req.user
        console.log(reqData.client)

        const { _id } = await appointmentService.addAppointment(reqData)

        return helper.sendResponseMsg(res, `Rendez-vous créer avec succès. Ref:${ _id }`, true, 200 )
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
} 

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
        return helper.sendResponseMsg(res, "Cet utilisateur n'a pas le droit de créer un rendez-vous.", false, 403)

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