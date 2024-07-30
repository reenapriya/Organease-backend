// const nodemailer=require("nodemailer")



// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_ADDRESS,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
  
//   var mailOptions = {
//     from: process.env.EMAIL_ADDRESS,
//     to: "reenapriya2002rp@gmail.com",
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("successfully sent");
//     }
//   });

//   module.exports=sendMail
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email successfully sent: " + info.response);
    }
  });
};

module.exports = sendMail;
