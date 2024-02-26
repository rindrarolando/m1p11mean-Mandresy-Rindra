const multer = require('multer')
const path = require('path')
const serviceService = require('../services/serviceService')
const employeeService = require('../services/employeeService.js')
const helper = require('../helpers/common')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination folder based on file type or any other criteria
        let folder

        // Assuming the file is related to employees if the field name is 'employeeFile'
        if (file.fieldname === 'employeeFile') {
            folder = 'uploads/employees/'
        }
        // Assuming the file is related to services if the field name is 'serviceFile'
        else if (file.fieldname === 'serviceFile') {
            folder = 'uploads/services/'
        }
        // Default to 'uploads/' if no specific folder is determined
        else {
            folder = 'uploads/'
        }

        cb(null, folder)
    },
    filename: async (req, file, cb) => {
        try{
            let filename = file.originalname
        
            // Assuming the file is related to employees if the field name is 'employeeFile'
            if (file.fieldname === 'employeeFile') {
                const employee = await employeeService.getOneEmployee(req.params.id)
                if(!employee)
                    throw Error(`Aucun employée a ${ req.params.id } comme ID`)
                
                filename = employee._id + '.png'
            }
            // Assuming the file is related to services if the field name is 'serviceFile'
            else if (file.fieldname === 'serviceFile') {
                let data = { ...req.body}
                delete data.serviceFile
        
                const newService = await serviceService.addService(data)

                filename = newService._id.toString() + '.png'
            }
            cb(null, filename)
        }
        catch(e){
            helper.prettyLog(`catching ${e}`)
            helper.log2File(e.message,'error')
            cb(e)
            req.error = e.message
        }
    },
});
const upload = multer({ storage })

module.exports = upload