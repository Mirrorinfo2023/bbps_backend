const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folder exists
const uploadFolder = 'uploads/prime_requests/';
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // allow png too
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error("Only .jpg, .jpeg, .png allowed"));
};

// Multer upload middleware
const uploadMiddleware = multer({ storage, fileFilter }).array('images', 5); // max 5 images

module.exports = {
  uploadMiddleware,
  // ...other controller functions like createRequest, getAllRequests
};
