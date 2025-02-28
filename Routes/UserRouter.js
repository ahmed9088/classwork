const exp=require('express')
const router = exp.Router()
const userController=require('../Controller/userController')
const multer=require('multer')  //deploy storage free
const path = require('path');
const MiddleWare=require('../middleWare/MiddleWare')

const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, 'uploads'); // Save files in "uploads" folder
//   },
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
//   }
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage: storage });

router.post('/signUp',userController.SignUpUser  )
router.post('/verifyotp',userController.verifyOTP)
router.post('/completed_profile',upload.single('file'),userController.CompletedProfile)
router.post('/login',userController.LoginUser)


router.post('/create_task',MiddleWare.verifyToken,upload.single('file'),userController.CreateTask)
router.get('/get_task',MiddleWare.verifyToken,userController.readTask)
router.get('/get_task/:id',userController.TaskReadById)
router.put('/update_task/:id',userController.updateTask)
router.delete('/delete_task/:id',userController.deleteTask)


router.post('/uploadImage',upload.single('file') ,userController.uploadImage)

module.exports=router