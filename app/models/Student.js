var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    joinDate:{
        type:Date,
        default:Date.now
    },
    major:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:"No Description"
    },
    pic:{
        type:String,
        default:"uploads/default.jpg"
    }
})

var Student = mongoose.model("student", studentSchema);

module.exports = Student;