exports.authPermission = (...allowedRoles) => {
    return (req, res, next) => {
        const allowedRole = allowedRoles.find(role => role === req.user.role)
        if(allowedRole)
            next()
        else {
            res.status(401)
            return res.send('Not Allowed')
        }
    }
}