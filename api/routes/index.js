const express = require('express')
const auth = require('./auth')
const user = require('./user')
const admin = require('./admin')
const employee = require('./employee')
const appointment = require('./appointment')
const helper = require('../helpers/common')
const { authRole } = require('../middlewares/role')
const authenticate = require('../middlewares/authenticate')
const { ROLE } = require('../rbac/roles')
module.exports = app => {

    app.get('/', (req, res) => {
        return helper.sendResponseMsg(res, `Welcome to ${ process.env.APP_NAME }`, true, 200)
    })

    app.use('/api/auth',auth)
    app.use('/api/user', authenticate, authRole(ROLE.USER), user)
    app.use('/api/employee', authenticate, authRole(ROLE.EMPLOYEE), employee)
    app.use('/api/admin', authenticate, authRole(ROLE.ADMIN), admin)
    app.use('/api/appointment', authenticate, appointment)

}