const authService = require('../services/authService')
const userService = require('../services/userService')
const { v4: uuidv4 } = require('uuid')
const helper = require('../helpers/common')
const { sendEmail } = require('../helpers/emailer')
const dirHelper = require('../helpers/DIR_helper')
const config = require('../config/keys')
const tokenService = require('../services/tokenService')
const Cryptr = require('cryptr')
const crpytR = new Cryptr(process.env.CRYPTR_EMAIL_SECRET)  
const {checkRefreshToken} = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
var jwtDecode = require('jwt-decode')
const { transporter } = require('../config/init')

async function sendVerificationEmail(user, req, res){
    try {
        let token = await userService.generateVerificationToken(user)

        const em = crpytR.encrypt(user.email)

        const verifyLink = process.env.PRODUCTION === "true" ? 
            `${process.env.PROD_URL}${config.emailUrl}${token.token}`
            : `http://${process.env.LOCAL_IP}:${process.env.PORT}${config.emailLocalUrl}${token.token}` 

        const emailOptions = {
            from: process.env.FROM_EMAIL,    
            to: user.email,
            subject: `Bienvenue chez ${ process.env.APP_NAME }`,
            html: `Pour confirmer votre compte ${ process.env.APP_NAME }, cliquez <a href="${ verifyLink }">ici</a>.`,
        }
        sendEmail(transporter, emailOptions).catch(error => {
            console.error(error) 
        })
        
        var responseObj = { success: true, 
            message:`A verification email has been sent to ${user.email}`
        }
        if(process.env.PRODUCTION !== "true")
            Object.assign(responseObj, {link:verifyLink} )

        helper.sendResponse(res, responseObj)
    } catch (e) {
        console.log(e)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}

const register =  async (req, res) => {

    try{
        const data = { email, firstName, lastName, password, gender} = req.body
       
        let user = await userService.getUserByEmail(data.email)
        if(user) 
            return helper.sendResponse(res,{success: false, message: 'An user with this email already exists'})

        user =  await userService.addUser(data)
        if(user.err)   
            return helper.sendResponse(res, {success: false, message:'Account Registration failed', err:user.err})
        
        await dirHelper.createDIR(`${config.directories.uploadsPrivate}/${user._id}`)  
 
        await sendVerificationEmail(user, req, res) 
            
        return true
    }
    catch(e){
        helper.prettyLog(`catching ${e}`)
        helper.log2File(e.message,'error')
        return helper.sendResponse(res, 500, {message:e.message, success:false})
    }
}
const refresh = async (req, res) => {
    try {
        const decoded = helper.decodeToken(req)
        //verify token by secret
        const check = checkRefreshToken(decoded, res) 
        //verify token's email exists in db
        let user = await userService.getUserByField({email:decoded.email}) 

        if(!user || !check) 
            return helper.sendResponse(res, {success: false, message: 'Invalid token'} )
        
        const payload = {
            email: decoded.email,
            id: decoded.id,
            time: new Date()
        }
        let refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
            algorithm: config.REFRESH_TOKEN_ALGO,
            expiresIn: config.REFRESH_TOKEN_LIFE
        })
        Object.assign(payload, {refreshToken})
        
        var token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.tokenExpireTime
        })
        
        return helper.sendResponse(res, {success: true, data: { token }})
        
    } catch (error) {
        helper.prettyLog(error)
        helper.log2File(error.message,'error')
        return helper.sendResponse(res, 500,{success: false, message: error.message} )
    }
}
const resendToken = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userService.getUserByEmail(email || '')
        
        if(!user) 
            return helper.sendResponse(res,{ message: `This email address is not associated with any account. Double-check your email address and try again.`})

        if(user.isVerified) 
            return helper.sendResponse(res,{ message: 'This account has already been verified. Please log in.' })

        await sendVerificationEmail(user, req, res) 
        
        return true
      
    } catch (error) {
        helper.log2File(error.message,'error')
        return helper.sendResponse(res, 500, {message:error.message, success:false})
    }
}

const verify = async (req, res) => { 
    try {
        // unable to find a user for this token.
        if(!req.params.token) 
            return helper.sendResponse(res,{message: "Invalid link.", success:false}) 

        const token = await tokenService.getToken(req.params.token)
        if (!token) 
            return helper.sendResponse(res, { message: 'We were unable to verify your email. Your link my have expired.', success:false }) //We were unable to find a valid token. Your token my have expired.

        const user = userService.getUserByID(token.userId)
        if(!user) 
            return helper.sendResponse(res, { message: 'Acoont not registered', success:false }) //We were unable to find a user for this token.

        if(user.isVerified) 
            return helper.sendResponse(res, { message: 'You have already been verified.', success:false }) //You have already been verified.
        
        const verified = await userService.updateUser(token.userId, {isVerified:true})
        
        if(verified) {
            return authService.authenticateOnVerification({email:verified.email})
            .then(token => {
                helper.sendResponse(res, {success: true, data: { token }})
                tokenService.deleteToken(req.params.token) //delete token as its not needed anymore
            })
            .catch(err => {
                helper.prettyLog(err)
                helper.log2File(err.message,'error')
                helper.sendResponse(res, {success: false, message: err.message} )
            })
        }


    } catch (error) {
        helper.log2File(error.message,'error')
        return helper.sendResponse(res, 500, {message:error.message, success:false})
    }
}

const login = async (req, res) => {
    try {
        return await authService.authenticate(req.body)
        .then(token => {
            helper.sendResponse(res, {success: true, data: { token }})
        })
        .catch(err => {
            helper.prettyLog(err)
            helper.log2File(err.message,'error')
            helper.sendResponse(res, 403, {success: false, message: err.message} )
        })    
    } catch (error) {
        helper.prettyLog(error)
        helper.log2File(error.message,'error')
        return helper.sendResponse(res, 500,{success: false, message: error.message} )
    }
}

module.exports = {
    login,
    register,
    refresh,
    resendToken,
    verify
}