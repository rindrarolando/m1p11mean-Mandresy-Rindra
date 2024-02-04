const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },    

}, {timestamps: true});

module.exports = mongoose.model('Appointments', Schema);