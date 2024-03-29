const { User } = require('../models/user')
var ObjectID = require('mongoose').Types.ObjectId

const hiddedField =  ['-password' ]

const findClientUsers = async () => {
      // Find users with role "user"
      const clientUsers = await User.find({ role: "user" }).select(hiddedField)
      return clientUsers
}

const addUser = async data => { return await new User(data).save() }

const getUserByEmail = async email => { return User.findOne({email}).select(hiddedField) }

const getUserByID = async id => {return await User.findById(id).select(hiddedField)}

const getUserByIdWithfields = async (id, fields) => { return await User.findById(id).select(fields) }

const getUserByEmailWithFields = async (email, fields) => { return await User.findOne({email}).select(fields) }

const updateUser = async (id, update,select) => {
    return await User.findOneAndUpdate({_id: new ObjectID(id)}, update, {
        new: true
    }).select(select)
}

const generateVerificationToken = async (user) => {
    const token = user.generateVerificationToken()
    return await token.save() 
}

const getUserByField = async field => {
    return await User.findOne(field)
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserByID,
    getUserByIdWithfields,
    updateUser,
    generateVerificationToken,
    getUserByField,
    getUserByEmailWithFields,
    findClientUsers
}
