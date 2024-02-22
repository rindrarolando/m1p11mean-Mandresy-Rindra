const multer = require('multer')
const path = require('path')
const serviceService = require('../services/serviceService')

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
                
            }
            // Assuming the file is related to services if the field name is 'serviceFile'
            else if (file.fieldname === 'serviceFile') {
                let data = { ...req.body}
                delete data.serviceFile
        
                const newService = await serviceService.addService(data)

                const extension = path.extname(file.originalname)
                filename = newService._id.toString() + extension
            }
            cb(null, filename)
        }
        catch(e){
            helper.prettyLog(`catching ${e}`)
            helper.log2File(e.message,'error')
            req.error = e.message
        }
    },
});
const upload = multer({ storage })

module.exports = upload