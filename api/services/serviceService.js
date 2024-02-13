const { Service } = require('../models/service')

const addService = async data => { return await new Service(data).save() }

const getServices = async (options) => { 
    return await Service.paginate({}, options)
}

const getOneService = async serviceID => { return await Service.findById(serviceID) }

const updateService = async (id, update,select) => {
    return await Service.findOneAndUpdate({_id: id}, update, {
        new: true
    }).select(select)
}

const deleteService = async serviceID => { 
    await Service.findByIdAndDelete(serviceID)
}

module.exports = {
    addService,
    getServices,
    getOneService,
    updateService,
    deleteService
}