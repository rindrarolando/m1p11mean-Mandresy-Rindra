const config = require('./keys')
const DIRHelper  = require('../helpers/DIR_helper')
const helper = require('../helpers/common')
const nodemailer = require('nodemailer')

const createDirectories = async () => {
    try {
        Object.values(config.directories).forEach(d => { 
            if(!DIRHelper.checkDIR(d)){ 
                DIRHelper.createDIR(d) 
                console.log(`Directory ${d} Created Successfully`)
            }  
        })          
    } catch (error) {
        helper.log2File(error.message,'error')
    }
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

module.exports = {
    createDirectories,
    transporter
}
