const mogoose=require('mongoose')
const { number } = require('joi')


const authModel=mogoose.Schema({
    name:{
      type:String,
        required:true,
    },
    email:{
      type:String,
        required:true,
    },
    password:{
      type:String,
        required:true,
    },
    otp:{
      type:Number,
      require:true,
    },
    isVerify:{
      type:Boolean,
      default:false,
    },
    completeProfile:{
      type:Boolean,
      default:false,
    }
})

module.exports=mogoose.model('auth',authModel)