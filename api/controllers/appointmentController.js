const helper = require('../helpers/common')
const appointmentService = require('../services/appointmentService')
const { canViewAppointment, canAddAppointment, canDeleteAppointment, scopedAppointments, canViewAppointmentHistory, canMarkAppointmentAsDone } = require('../rbac/permissions')
const ObjectID = require('mongoose').Types.ObjectId
const serviceService = require('../services/serviceService')
const employeeService = require('../services/employeeService.js')
const { ROLE } = require('../rbac/roles.js')
const employeeTaskService = require('../services/employeeTaskService.js')
const specialOfferService = require('../services/specialOfferService.js')

const getDailyAppointmentsCount = async (req, res) => {
    try {
        const { month } = req.params
        const result = await appointmentService.getDailyAppointmentsCount(month)
        helper.sendResponseMsg(res, result, true, 200)
    } catch (e) {
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const markAppointmentAsDone = async (req, res) => {
    try{
        const appointment = await appointmentService.markAppointmentAsDone(req.appointment._id)
        if(appointment){
            // create employee task for each service done
            const mapServiceEmployees = appointment.mapServiceEmployees
            for(let i = 0; i < mapServiceEmployees.length; i++) {
                await employeeTaskService.addTask(mapServiceEmployees[i])
            }

            helper.sendResponseMsg(res, appointment, true, 200)
        }
        else {
            helper.sendResponse(res, 500, "Une erreur est survenue durant la mise à jour du rendez-vous")
        }
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const getAppointmentHistory = async (req, res) => {
    try {
        // check the authenticated user
        const user = req.user
        const startDateTime = req.query.startDateTime
        const endDateTime = req.query.endDateTime ? new Date(req.query.endDateTime) : false
        if(!user)
            throw new Error('Aucun utilisateur connecté')

        // if the user is a client
        if(user.role === ROLE.USER) {
            const appointments = await appointmentService.getClientAppointmentHistory(user._id, startDateTime, endDateTime)
            helper.sendResponse(res, appointments)
        } else if(user.role === ROLE.EMPLOYEE ) {
            const appointments = await appointmentService.getEmployeeAppointmentHistory(user._id, startDateTime, endDateTime)
            helper.sendResponse(res, appointments)
        } else {
            helper.sendResponseMsg(res, "Cet utilisateur n'est ni un employé ni un client", false, 401)
        }

    } catch (error) {
        helper.prettyLog(`catching ${error}`)
        helper.log2File(error.message,'error')
        return helper.sendResponse(res, 500, {message:error.message, success:false})
    }
    
}



const addNewAppointment = async (req, res) => {
    try{
        // retrieve the data from the http client
        let reqData = req.body
        const client = res.user
        reqData.startDateTime = new Date(reqData.startDateTime)
        let mapServiceEmployees = []
        let nextServiceStartDateTime = reqData.startDateTime
        let price = 0

        // verify if the data from the http client are legit
        // ora, calcolare la data di fine dell'appuntamento
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

            // Verify if the employee doesn't have something else to do
            const isEmployeeBusy = await employeeService.isEmployeeBusyDuringTimeRange(employee._id, nextServiceStartDateTime, service.duration)
            if (isEmployeeBusy) {
                const msg = `${employee.user.firstName} ${employee.user.lastName} a déjà un autre rendez-vous durant à cet date et heure`
                helper.sendResponse(res, 400, {message: msg, success:false})
            }
            
            // push it, push it! 
            mapServiceEmployees.push({employee, service, startDateTime: nextServiceStartDateTime})

            // the next service start date time = this service start date time + this service's duration
            nextServiceStartDateTime = new Date(nextServiceStartDateTime.getTime() + service.duration*60000)
            lastServiceDuration = service.duration
        }
        reqData.endDateTime = nextServiceStartDateTime
        
        reqData.status = 'booked'
        reqData.mapServiceEmployees = mapServiceEmployees
        
        // if special offer code exist, then: price = price * specialoffer.discountPercentage/100
        if(reqData.discountCode) {
            // find the special offer by code
            const specialOffer = await specialOfferService.findSpecialOfferByCode(reqData.discountCode)
            if(specialOffer === null) {
                return helper.sendResponse(res, 404, {message:'Code promo non trouvé', success:false})
            }

            // appointment price
            reqData.price = price * specialOffer.discountPercentage/100
            reqData.discountPercentage = specialOffer.discountPercentage
        } else {
            reqData.price = price
        }

        // the authenticated user is the client
        reqData.client = req.user

        const { _id } = await appointmentService.addAppointment(reqData)

        return helper.sendResponseMsg(res, `Rendez-vous créer avec succès. Ref:${ _id }`, true, 200 )
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
} 

const authMarkAppointmentAsDone = async (req, res, next) => {
    if(!canMarkAppointmentAsDone(req.user))
        return helper.sendResponseMsg(res, 'Non autorisé', false, 401)

    next()
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
    const id = req.params.id
    req.appointment = await appointmentService.getOneAppointment(id)
    
    if (req.appointment == null)
        return helper.sendResponseMsg(res, `Aucun rendez-vous n'a ${ id } comme ref`, false, 404)
    
    next()
}

function authGetAppointment(req, res, next) {
    if(!canViewAppointment(req.user, req.appointment))
        return helper.sendResponseMsg(res, 'Not Allowed', false, 401)

    next()
}

function authAddAppointment(req, res, next){
    if(!canAddAppointment(req.user))
        return helper.sendResponseMsg(res, "Cet utilisateur n'a pas le droit de créer un rendez-vous.", false, 401)

    next()
}

function authViewAppointmentHistory(req, res, next){
    if(!canViewAppointmentHistory(req.user))
        return helper.sendResponseMsg(res, "Cet utilisateur n'a pas le droit de voir l'historique de rendez-vous.", false, 401)

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
    getAppointmentHistory,
    authViewAppointmentHistory,
    markAppointmentAsDone,
    authMarkAppointmentAsDone,
    getDailyAppointmentsCount
}