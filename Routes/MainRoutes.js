const exp=require('express')
const router = exp.Router()
const userRoutes=require('./UserRouter')

router.use('/user',userRoutes)

module.exports=router