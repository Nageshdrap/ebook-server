const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    googleId:{
        type:String,
        default:null
    },
    uname :{
        type: String,
        minLegth:2,
        maxLength:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    cpassword:{
        type:String,
    },
    phone:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


module.exports = mongoose.model('UserInfo',userSchema);

