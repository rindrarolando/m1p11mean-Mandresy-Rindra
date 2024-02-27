const mongoose = require('mongoose')

const SpecialOfferSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    services: [],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
})

UserSchema.index({code: 1}, { unique: true})

module.exports = {
    SpecialOfferSchema,
    SpecialOffer: mongoose.model('SpecialOffer', SpecialOfferSchema)
}