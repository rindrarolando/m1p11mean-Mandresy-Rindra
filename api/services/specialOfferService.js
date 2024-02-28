const { SpecialOffer } = require("../models/specialOffer")
const emailer = require('../helpers/emailer')
const { transporter } = require('../config/init')
const userService = require('../services/userService')
const serviceService = require('../services/serviceService')
const ObjectID = require('mongoose').Types.ObjectId

const addSpecialOffer = async (specialOffer) => { 
    const createdSpecialOffer = await SpecialOffer.create(specialOffer)

    // Fetch all client users
    const clientUsers = await userService.findClientUsers()

    // Send email to each client user
    for (const user of clientUsers) {
        const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: `Une nouvelle offre spéciale pour vous: ${createdSpecialOffer.title}`,
        html: `${createdSpecialOffer.description}<br>Pour profiter, cliquez <a href="${ process.env.FRONT_URL }/offers/${createdSpecialOffer.code}">ici</a>.`,
        }

        await emailer.sendEmail(transporter, mailOptions)
    }

    return createdSpecialOffer
}

const findSpecialOfferByCode = async (code) => {
    const specialOffer = await SpecialOffer.findOne({ code }).lean()
    if (!specialOffer) {
        return null
    }

    const services = await Promise.all(
        specialOffer.serviceIds.map(async (serviceId) => {
            return await serviceService.getOneService(new ObjectID(serviceId))
        })
    )

    // Remove the serviceIds property and add the services array to the specialOffer object
    const { serviceIds, ...specialOfferWithoutServiceIds } = specialOffer
    specialOfferWithoutServiceIds.services = services

    return specialOfferWithoutServiceIds
}

module.exports = {
    addSpecialOffer,
    findSpecialOfferByCode
}