const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName:{
        type:String,
        required:[true,'First name is required']
    },
    lastName:{
        type:String,
        required:[true,'Last name is required']
    },
    phone:{
        type:String,
        required:[true,'Number is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'Address is required']
    },
    skills:{
        type:String,
        required:[true,'Skill is required']
    },
    experience:{
        type:String,
        required:[true,'Experience is required']
    },
    price:{
        type:Number,
        required:[true,'Price is required']
    },
    status:{
        type:String,
        default:'pending'
    },
    timings:{
        type:Object,
        required:[true,'Time is required']
    },
},{timestamps:true});

const workerModel = mongoose.model("workers", workerSchema);

module.exports = workerModel;