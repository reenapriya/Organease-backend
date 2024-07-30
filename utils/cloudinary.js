// const cloudinary=require("cloudinary").v2
// //require("dotenv").config();

// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_SECRET_KEY
// })

// const uploadToCloudinary = (fileBuffer, options) => {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream( //object
//         options,
//           (error, result) => {
//           if (error) {
//             reject(error)
//           }
//           else {
//             resolve(result);
//           }
//         }
//       ).end(fileBuffer)
//     });
//   };

//   module.exports=uploadToCloudinary
// module.exports=cloudinary
// utils/cloudinary.js

const cloudinary = require('cloudinary').v2;

// Configure your cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    }).end(buffer);
  });
};

module.exports = uploadToCloudinary;
