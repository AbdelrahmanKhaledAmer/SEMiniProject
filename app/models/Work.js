var mongoose = require('mongoose');

var workSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    Description:{
        type:String,
        default:"No Description Provided"
    },
    file:{
        type:String,
        required:true
    }
})

var Work = mongoose.model("work", workSchema);

module.exports = Work;