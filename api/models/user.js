const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Token = require('../models/token');
const config = require('../config/keys')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'User email is required',
        trim: true
    },

    password: {
        type: String,
        required: 'User password is required',
        max: 100
    },

    firstName: {
        type: String,
        required: 'First Name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },

    gender: {
        type: String,
        enum: ['M', 'F'],
        required: 'An user should have a gender'
    },

    profileImage: {
        type: String,
        required: false,
    },
    
    isVerified: {
        type: Boolean,
        default: false
    },
    
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        timezone: false,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ["user", "employee", "admin"]
    },
    isEnabled:{
        type:Boolean,
        default:true
    },
    mobile_number:{
        type:String,
        required:false
    },
    

});

UserSchema.index({email: 1}, { unique: true})

UserSchema.pre('save',  function(next) {
    const user = this

    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

//works only on registration
UserSchema.methods.generateJWT = function() {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60);
    
    let payload = {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        // profilePicture:this.profileImage,
        role:this.role,
    }
    
    
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.tokenExpireTime
    })
}

UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}

UserSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token:crypto.randomBytes(20).toString('hex')
    }
    return new Token(payload)
}

module.exports = {
    User: mongoose.model('User', UserSchema),
    UserSchema
}