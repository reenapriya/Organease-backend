
// const multer = require("multer");
// const storage = multer.memoryStorage()

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {

//             cb(null, true); // Define your upload directory
//         }
//         else {
//             cb(new Error("upload image only", false));
//         }

//     }})




// module.exports = upload;
const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') ) {
          cb(null, true); // Accept file
      } else {
          cb(new Error('Only images and pdf are allowed'), false); // Reject file
      }
  }
});

module.exports=upload 
