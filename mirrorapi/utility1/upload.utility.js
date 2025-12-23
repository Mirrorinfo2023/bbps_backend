const multer = require('multer');
const path = require('path');

const multerStorage = (destinationPath)=>{
    console.log(destinationPath);
    return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
};
  const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|pdf)$/)) {
      // upload only  jpg format
      return cb(new Error('Please upload jpg or pdf format only.'));
    }
    if (file.size > 1 * 1024 * 1024) {
      cb(new Error('File size exceeds the limit (1MB)'));
       // Accept the file
    }
    cb(null, true);
    
  };

  const configureMulter  = (destinationPath) => {
    return multer({
      storage: multerStorage(destinationPath),
      fileFilter: multerFilter
    });
  }
  
module.exports = { configureMulter };