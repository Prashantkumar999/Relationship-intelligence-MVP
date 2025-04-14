const mongoose = require("mongoose")

const connectDB = async()=>{
    try{

    }catch(error){
        console.error("DB connection failed:",error)
        process.exit(1)
    }
}