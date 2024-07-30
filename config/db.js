const mongoose=require("mongoose")
const configurationDb=async()=>{
    try{
        const db= await mongoose.connect(`${process.env.Db}/ORGANEASEPROJECT`)
        console.log("successfully connected to db")

    }
    catch(e){
        console.log(err)
    }
   
}

module.exports= configurationDb