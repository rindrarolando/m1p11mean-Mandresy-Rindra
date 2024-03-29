const {validationResult} = require('express-validator');
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req.body);
        let error = {}
        errors.array().map((err) => error[err.param] = err.msg)
        return res.status(422).json({error, success:false})
    }

    next();
}