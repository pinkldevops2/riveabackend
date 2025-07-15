const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
        + path.extname(file.originalname))
      },
    
    
});

const fileFilter = (req, file, cb) => {

    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "text/csv",
        "image/svg+xml",
        "video/mp4",
        "video/ogg",
      ];
    
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        return cb(new Error("Invalid file type."), false );
      }

}

const maxSize = 5 * 1024 * 1024;

const fileLimits = {
  fileSize: maxSize,
  files: 4,
  fileSize: maxSize
}

const upload  = multer({ storage: storage, fileFilter: fileFilter, limits: fileLimits });

module.exports = {
  upload
 }