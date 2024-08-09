require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const userCtrl = require("./app/controller/user-cntrl")
const authenticateUser = require("./app/middleware/authenticate")
const authorizeUser = require("./app/middleware/authorization")
const { checkSchema } = require("express-validator")
const centreCtrl = require("./app/controller/centre-cntrl")
const centreValidation = require("./app/validation/centre-validation")
const hospitalValidation = require("./app/validation/hospital-validation")
const hospitalCtrl = require("./app/controller/hospital-cntrl")
const categoryCtrl = require("./app/controller/category-cntrl")
const categoryValidation = require("./app/validation/category-validation")
const organCtrl = require("./app/controller/organ-cntrl")
const requestCtrl=require("./app/controller/request-cntrl")
const app = express()
app.use(morgan("combined"))
const  fs = require('fs')
const path = require('path')
const cloudinary=require("./utils/cloudinary")
const upload=require("./app/middleware/multer")
const paymentCntrl=require("./app/controller/payment-cntrl")

app.use(cors())
app.use(express.json())
const port = 2525
const configurationDb = require("./config/db")
const organValidation = require("./app/validation/organ-validation")
const patientValidation = require("./app/validation/patient-validation")
const patientCtrl = require("./app/controller/patient-cntrl")
const Hospital = require("./app/models/hospital-model")
configurationDb()

app.post("/signup", userCtrl.register)
app.post("/login", userCtrl.login)
app.post('/forgot-password', userCtrl.forgotPassword);
app.post('/reset-password/:id/:token', userCtrl.resetPassword);
app.get("/account", authenticateUser, userCtrl.account)


//centre profile:
app.post("/register", upload.single("license") ,authenticateUser, authorizeUser(["Centre"]),  centreCtrl.register)
app.get("/showAll", authenticateUser, authorizeUser(["Centre","Hospital"]), centreCtrl.show)
app.get("/showOne/:cid", authenticateUser, authorizeUser(["Centre","Hospital"]), centreCtrl.showOne)
app.put("/update/:id", authenticateUser, authorizeUser(["Centre"]), centreCtrl.update)
app.delete("/delete/:id", authenticateUser, authorizeUser(["Centre"]), centreCtrl.delete)
app.get("/centreMyshow",authenticateUser,authorizeUser(["Centre"]),centreCtrl.myshow)
//hospital profile::
app.post("/hospitaldetails", authenticateUser, authorizeUser(["Hospital"]), hospitalCtrl.register)
app.get("/hospitalShow", authenticateUser, authorizeUser(["Hospital", "Centre"]), hospitalCtrl.showAll)
app.get("/hospitalShowOne/:hid", authenticateUser, authorizeUser(["Hospital","Centre"]), hospitalCtrl.show)
app.put("/hospitalupdate/:id", authenticateUser, authorizeUser(["Hospital"]), hospitalCtrl.update)
app.delete("/hospitalDelete/:id", authenticateUser, authorizeUser(["Hospital"]), hospitalCtrl.delete)
app.get("/hospitalMyshow",authenticateUser,authorizeUser(["Hospital"]),hospitalCtrl.myShow)
//category:
app.post("/categorycreate", authenticateUser, authorizeUser(["Centre"]), checkSchema(categoryValidation), categoryCtrl.create)
app.get("/cateShow", authenticateUser, authorizeUser(["Centre", "Hospital"]), categoryCtrl.show)
app.get("/cateMyShow", authenticateUser, authorizeUser(["Centre"]), categoryCtrl.myshow)

app.get("/catShowOne/:id", authenticateUser, authorizeUser(["Centre", "Hospital"]), categoryCtrl.showOne)
app.put("/catUpdate/:id", authenticateUser, authorizeUser(["Centre"]), categoryCtrl.update)
app.delete("/catDelete/:id", authenticateUser, authorizeUser(["Centre"]), categoryCtrl.delete)

//organ :
app.post("/organcreate/category/:oid", authenticateUser, authorizeUser(["Centre"]), organCtrl.create)
app.get("/organShowOne/category/:oid/organ/:id", authenticateUser, authorizeUser(["Centre", "Hospital"]), organCtrl.showOne)
app.get("/search", organCtrl.mysearchget)
app.get("/organShow/category/:oid", authenticateUser, authorizeUser(["Centre", "Hospital"]), organCtrl.myshow)
app.put("/organUpdate/category/:oid/organ/:id", authenticateUser, authorizeUser(["Centre"]), organCtrl.update);
app.delete("/organRemove/category/:oid/organ/:id", authenticateUser, authorizeUser(["Centre"]), organCtrl.remove) ;
app.post('/confirmRequest/:id/:oid', organCtrl.confirmRequest);
app.put('/organ/:id/status',organCtrl.status)


//patient:
app.post("/patientcreate", authenticateUser, authorizeUser(["Hospital"]), checkSchema(patientValidation), patientCtrl.create)
app.get("/patientShowOne/:hid", authenticateUser, authorizeUser(["Hospital", "Centre"]), patientCtrl.showOne)
app.put("/patientUpdate/:id", authenticateUser, authorizeUser(["Hospital"]), patientCtrl.update)
app.delete("/patientRemove/:id", authenticateUser, authorizeUser(["Hospiatl"]), patientCtrl.remove)
app.get("/patientShowAll",authenticateUser,authorizeUser(["Hospital"]),patientCtrl.showAll)
//request :
app.post("/requestcreate",authenticateUser,authorizeUser(["Hospital","Centre"]),requestCtrl.create)
app.get("/hospitalrequestShow/:hid",authenticateUser,authorizeUser(["Hospital"]),requestCtrl.show)

app.get("/centrerequestShow/:cid",authenticateUser,authorizeUser(["Centre"]),requestCtrl.showForCentre)
app.put("/centrerequestUpdate/:id",authenticateUser,authorizeUser(["Centre"]),requestCtrl.update)
app.get("/showOnerequest/:id",authenticateUser,authorizeUser(["Centre","Hospital"]),requestCtrl.showOne)
app.get('/latestRequests',requestCtrl.latest)

//payment
app.post('/payment/pay',paymentCntrl.pay)
app.put('/payment/success/:stripeId',paymentCntrl.successUpdate)
app.put('/payment/failed/:stripeId',paymentCntrl.failedUpdate)
app.get('/payment/status/:cid',paymentCntrl.status)

app.listen(port, () => {
    console.log("sucessfully connected port")

})


//