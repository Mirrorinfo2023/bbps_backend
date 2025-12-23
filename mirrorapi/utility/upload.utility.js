const multer = require("multer");
const path = require("path");
const fs = require("fs");

const multerStorage = (getDestinationPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      // Allow both string and function
      let destinationPath =
        typeof getDestinationPath === "function"
          ? getDestinationPath(req)
          : getDestinationPath;

      if (!destinationPath || typeof destinationPath !== "string") {
        return cb(new Error("Invalid destination path"));
      }

      // Ensure directory exists
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  });
};

const multerFilter = (req, file, cb) => {
  const allowedTypes = /\.(jpg|jpeg|png|pdf)$/i;
  if (!allowedTypes.test(file.originalname)) {
    return cb(new Error("Please upload only jpg, jpeg, png, or pdf format."));
  }
  cb(null, true);
};

const configureMulter = (getDestinationPath) => {
  return multer({
    storage: multerStorage(getDestinationPath),
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  });
};

module.exports = { configureMulter };
