const mongoose = require('mongoose')
const ObjectID = require('mongoose').Types.ObjectId

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
    serviceIds: [{
        type: ObjectID,
        ref: 'Service'
    }],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
})

SpecialOfferSchema.index({code: 1}, { unique: true})

module.exports = {
    SpecialOfferSchema,
    SpecialOffer: mongoose.model('SpecialOffer', SpecialOfferSchema)
}