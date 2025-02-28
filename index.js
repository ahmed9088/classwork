// const exp=require('express') //import
// const app=exp()
// const bodyParser = require('body-parser')

// const port =8000


// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.get('/',(req,res)=>{
//     console.log('get response')
//     res.send('request received')
// })
// app.get('/users',(req,res)=>{
//     console.log('get response')
//     res.send('request user received')
// })


// app.post('/',(req,res)=>{
//     console.log(req.body)
//     res.send(req.body)

// })


// // app.get('/',(req,res)=>{
// //     console.log('call Get apis')
// //     res.send('heelo')
// // })0


// app.listen(port,()=>{
// console.log('server work',port)
// })


const exp = require('express')
const bodyParser = require('body-parser')
const mainRoutes=require('./Routes/MainRoutes')
const formData = require("express-form-data");
const app=exp()
const mongoose=require('mongoose')
require('dotenv').config()
var cors = require('cors')


app.use(cors())
const port =3000

console.log(process.env.connetionDatabase)
let dbURL=process.env.connetionDatabase
mongoose.connect(dbURL)

const dbconnection=mongoose.connection

dbconnection.on('error',()=>{
console.log('errror')
})

dbconnection.once('open',()=>{
console.log(' mongo db connected')
})

app.get('/',(req,res)=>{
    res.send('work')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(formData.parse());




app.use(mainRoutes)



app.listen(port,()=>{
    console.log('server work',port)
})