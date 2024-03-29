const express = require('express')
const auth = require('./auth')
const user = require('./user')
const service = require('./service')
const employee = require('./employee')
const appointment = require('./appointment')
const helper = require('../helpers/common')
const { authRole } = require('../middlewares/role')
const authenticate = require('../middlewares/authenticate')
const { ROLE } = require('../rbac/roles')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const { authPermission } = require('../middlewares/permission')
const favorite = require('./favorite.js')
const specialOffer = require('./specialOffer.js')
const finance = require('./finance.js')

module.exports = app => {

    app.get('/', (req, res) => {
        return helper.sendResponseMsg(res, `Welcome to ${ process.env.APP_NAME }`, true, 200)
    })

    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{explorer: true}))
    app.use('/api/v1/auth',auth)
    app.use('/api/v1/user', authenticate, authRole(ROLE.USER), user)
    app.use('/api/v1/employees', authenticate, authPermission(ROLE.ADMIN, ROLE.EMPLOYEE), employee)
    app.use('/api/v1/services', authenticate, service)
    app.use('/api/v1/appointments', authenticate, appointment)
    app.use('/api/v1/favorites', authenticate, authRole(ROLE.USER), favorite)
    app.use('/api/v1/offers', authenticate, specialOffer)
    app.use('/api/v1/finances', authenticate, finance)

}