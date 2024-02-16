const helper = require('../helpers/common');
const { canAddService } = require('../rbac/permissions');
const serviceService = require('../services/serviceService')
const ObjectID = require('mongoose').Types.ObjectId; 

const getOneService = (req, res) => {

    return helper.sendResponse(res, {success:true, service:req.service})

}
const updateService = async (req, res) => {
    try {
        let service = await serviceService.updateService(req.service.id, req.body)

        return helper.sendResponse(res, {success:true, service})
    } catch (err) {
        helper.prettyLog(`catching ${err}`)
        helper.log2File(err.message,'error')
        return helper.sendResponse(res, 500, {message:err.message, success:false})
    }
}
const getServices = async (req, res) => {
    try {
        const services = await serviceService.getServices({page: req.query.pageNumber, limit: req.query.rowsPerPage})

        return helper.sendResponse(res, {success:true, services: services})

    } catch (e) {
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const addNewService = async (req, res) => {
    try{
        const data = { name } = req.body

        const createdBy = new ObjectID(req.user.id)

        Object.assign(data, {createdBy})

        await serviceService.addService(data)

        return helper.sendResponseMsg(res, 'Service successfully created', true, 200 )
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}   
const removeService = async (req, res) => {
    try{
        await serviceService.deleteService(req.params.id)
        
        return helper.sendResponseMsg(res, 'Service successfully deleted', true, 200 )
    }
    catch(e){
        console.log(e)
        // helper.prettyLog(`catching ${e}`)
        // helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}   

async function setService(req, res, next){
    const serviceId = req.params.id
    req.service = await serviceService.getOneService(serviceId)
    
    if (req.service == null)
        return helper.sendResponseMsg(res, 'Service non trouvé', false, 404)
    
    next()
}

function authAddService(req, res, next){
    if(!canAddService(req.user))
        return helper.sendResponseMsg(res, "Cet utilisateur n'a pas le droit de créer de service", false, 403)

    next()
}

function authUpdateService(req, res, next){
    if(!canAddService(req.user))
        return helper.sendResponseMsg(res, "Cet utilisateur n'a pas le droit de modifier ou supprimer un service", false, 403)

    next()
}

module.exports = { 
    setService,
    getOneService,
    getServices,
    addNewService,
    updateService,
    removeService,
    authAddService,
    authUpdateService
}