const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


// Register USer
const registerUser = asyncHandler(async (req, res) =>{
    const {name, email, password} = req.body

       if(!name || !email || !password){
          res.status(400)
          throw new Error('Please fill all field')
}

   // check if user exists
   const userExists = await User.findOne({email})
        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }

   // Hash password
   const salt = await bcrypt.genSalt(10)    
   const hashPassword= await bcrypt.hash(password, salt)

   // Create user
   const user = await User.create({
       name,
       email,
       password: hashPassword
   }) 
      if(user){
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
      } else{
          res.status(400)
          throw new Error('Invalid user data')
      }
    
})


// Login USer
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    // Check for user email
    const user = await User.findOne({ email })
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token:generateToken(user._id),
       
      })
    } else {
      res.status(400)
      throw new Error('Invalid credentials')
    }
  })
  


// Get user USer
const getMe =  asyncHandler(async (req, res) =>{
   const {_id, name, email} = await User.findById(req.user.id)

   res.status(200).json({
       id: _id,
       name,
       email, 
   })
})

// generate token
 const generateToken = (id) =>{
     return jwt.sign({id}, process.env.JWT_SECRET, {
         expiresIn:'20d',
     })
 }


module.exports = {
    registerUser,
    loginUser,
    getMe
}