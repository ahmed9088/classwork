const  userValidator=require('../Validation/UserVlidator')
const authModel=require('../Model/authModel')
const taskModels=require('../Model/taskModel')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const jwt=require('jsonwebtoken');
const taskModel = require('../Model/taskModel');
const { date } = require('joi');

require('dotenv').config()

const profileModel=require('../Model/profileModel')

exports.SignUpUser=async (req,res)=>{

    try{
        await userValidator.validateAsync(req.body)
        const {email,password}=req.body
        const findUser=await authModel.findOne({email})
        if(findUser){
            return res.status(201).json({
            message:"user already exist",
            data:findUser
            })
        }

        const password1=await bcrypt.hash(password,12)
        req.body.password=password1

        var otp=Math.floor(Math.random()*900000)
        console.log(otp)
        if(otp.length!=6){
            otp=Math.floor(Math.random()*900000)
        }
        req.body.otp=otp
       
        console.log('Sign Up')
        console.log(req.files)
        console.log(req.body)
        // console.log(process.env.email)
        // console.log(process.env.passKey)

            // node mailer
            const transporter = nodemailer.createTransport({
                service : "gmail",
                auth :{
                    user : process.env.smtpemail,
                    pass: process.env.smtppasskey,
                },
                tls: {
                    rejectUnauthorized: false
                }

            })

            const info = {
                from : process.env.smtpemail,
                to : email,
                subject : "Welcome to Aptech MAIL SERVICE",
                html :  `
                <h1>Verify Account</h1>
                <p>your otp is : ${otp}</p>   
                `

            }

            transporter.sendMail(info,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('send')
                }
            })
          
       
        const user=authModel(req.body)
         await user.save()

       const token=await jwt.sign({ user_id: user._id }, 'secret_key', { expiresIn: "2h" })

         console.log('token   :',token)
        
        res.status(200).json({
            message:'user Create',
            data:req.body,
            token
        })

    }catch(e){
        res.status(500).json({
            message:e
        })

    }
    
    }
exports.verifyOTP=async (req,res)=>{

    try{
        const {authorization}=req.headers
       

        console.log(authorization)
        const {otp}=req.body
        if(!authorization){
            return res.status(401).json({message:'Authorization is required'})
        }

        if(otp==undefined){
            return res.status(401).json(
                {
                    message:'OTP is required'
                }
            )
        }else{

            jwt.verify(authorization,'secret_key',async (err,decode)=>{
                if(err){
                    return res.status(401).json({message:'Invalid token'})
                }
                req.userid=decode.user_id
                const user=await authModel.findById(req.userid)

                if(!user){
                    return res.status(401).json({message:'User not found'})
                }

                if(otp==user.otp){
                   await user.updateOne({
                        isVerify:true
                    })
                    return res.status(200).json({message:'verify otp'})
                }else{
                    return res.status(401).json({message:'Invalid OTP'})
                }

            //     console.log(req.userid)

            //    return res.send({
            //         message:'user find',
            //         data:user
            //     })
            })

            

        }

        // console.log(authorization)
      
        // res.send("verify otp")

    }catch(e){
        res.status(500).json({
            message:e
        })

    }
    
    }

//completed 
    exports.CompletedProfile=async (req,res)=>{
    try{

        const { body, headers } = req
        const { authorization } = headers
       
        if (!authorization) return res.status(403).send('Access Denied');
        

       // console.log(req.file.path)
       jwt.verify(authorization, process.env.secret_key, async (err, decode) => {

        if (err) {
            return res.status(401).json({
                message: "unauthorization"
            })
        } else {
            console.log(decode)
                req.userId = decode.user_id
              
                var user = await authModel.findById(req.userId)
                console.log(user)

                if(user.completeProfile==false){


                    var obj = {
                        gender: req.body.gender,
                        contactNo: req.body.contactNo,
                        address: req.body.address,
                        Image: req.file.path,
                        authId: req.userId
                    }

                    let profile =profileModel(obj)

                   await profile.save()

                   await authModel.findByIdAndUpdate(req.userId, {
                    completeProfile: true,
                    // profileId:

                })
                return res.status(200).json({
                    message: "profile update",
                    // data: obj

                })
                    


                }else{
                    return   res.send({message:'Already completed'})

                }


            


        }

       })

      

    }catch(e){
        res.status(500).json({
            message:e
        })

    }
    
    }
 

    
exports.LoginUser=async (req,res)=>{
  try{

    let {email,password}=req.body

    if(email==undefined){
        return res.status(401).json({
        message:'Please enter email '
    })
    }else if(password ==undefined){
        return   res.status(401).json({message:'please enter password'})
    }else if(email==undefined  && password ==undefined){
        return   res.status(401).json({
            message:'Please enter email and password '
        })

    }else{

        const user=await authModel.findOne({email:email});



        if(!user){
            return res.status(401).json({message:'user not found'})
        }
  let match =await bcrypt.compare(password,user.password);
        if(user.email==email && match){
            const token=await jwt.sign({ user_id: user._id }, 'secret_key', { expiresIn: "2h" })
            return res.status(200).json({user,token})
        }else{
            return res.status(200).json({
                message:'Invalid or password '
            })

        }

        
    }
    
  }catch(e){

    res.status(500).json({
        status:'error',
        message:e

    })

  }
}



exports.CreateTask= async (req,res)=>{
    try{
        // const image = req.file ? req.file.path : null;


        // console.log(req.file)
        // console.log(req.body)
        req.body.image=req.file.path
console.log(req.body)
        let task=taskModels(req.body)
      await  task.save()

        res.status(201).json({
            message:'task created',
            data:req.body
        })

    }catch(e){
        res.status(500).json({
            message:e
        })
    }

}

exports.readTask=async(req,res)=>{
try{
    let task=await taskModels.find()

    res.status(200).json({
        message:'task read',
        data:task
    })

}catch(e){
    res.status(500).json({
        message:e
    })
}
}

exports.TaskReadById=async (req,res)=>{
try{
    let task=await taskModels.findById(req.params.id)


    res.status(200).json({
        message:"get by id",
        data:task
    })

}catch(e){
    res.status(500).json({
        message:e
    })
}


}


exports.updateTask=async(req,res)=>{
try{
    // let task=await taskModels.findByIdAndUpdate(req.params.id,req.body,{new:true})

    let task =await  taskModels.findByIdAndUpdate(req.params.id,req.body,{new:true})

    res.status(201).json({
        message:'task updated',
        data:task
    })

}catch(e){
    res.status(500).json({
        message:e
    })
}
}


exports.deleteTask=async(req,res)=>{
    try{
        // let task=await taskModels.findByIdAndUpdate(req.params.id,req.body,{new:true})
    
        let task =await  taskModels.findByIdAndDelete(req.params.id)
    
        if(!task){
            res.status(401).json({
                message:'not found',
             
            })
        }
        res.status(201).json({
            message:'deleted task',
         
        })
    
    }catch(e){
        res.status(500).json({
            message:e
        })
    }
    }

    exports.uploadImage=async (req,res)=>{
        try{

            console.log(req.file)

            res.send({
                message:'image uploaded',
                data:req.body,
                image:req.file.path
            })


        }catch(e){
            console.log(e)

            res.status(500).json({
                message:e
            })
        }
    }

