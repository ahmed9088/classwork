const { default: mongoose } = require('mongoose')
const mogoose=require('mongoose')

const taskModel=mogoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
})

module.exports=mogoose.model('taskModel',taskModel)