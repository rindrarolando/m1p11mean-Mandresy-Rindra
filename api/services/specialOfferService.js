const { SpecialOffer } = require("../models/specialOffer")
const emailer = require('../helpers/emailer')
const { transporter } = require('../config/init')
const userService = require('../services/userService')

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
        text: createdSpecialOffer.description,
        }

        await emailer.sendEmail(transporter, mailOptions)
    }

    return createdSpecialOffer
}

module.exports = {
    addSpecialOffer
}