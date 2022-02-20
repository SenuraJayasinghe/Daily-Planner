const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')
 

// get goals

const getGoals = asyncHandler( async(req, res) =>{
        
    const goals = await Goal.find({user:req.user.id})
    res.status(200).json(goals)
})

// set goals

const setGoals = asyncHandler(  async (req, res) =>{
     if (!req.body.text){
         res.status(400)
         throw new Error('Please add a text field');
     }
     const goal = await Goal.create({
         text: req.body.text,
         user: req.user.id
     })
    res.status(200).json(goal)
})


// update goals

const updateGoals = asyncHandler( async (req, res) =>{
    const goal = await Goal.findById(req.params.id)
        
    if (!goal){
        res.status(400)
        throw new Error('Goal not found');
    }
      const user = await User.findById(req.user.id)

      if(!user){
          res.status(401)
          throw new Error('User not found')
      }
           //logged in user matches the goal user
       if(goal.user.toString() !== user.id){
            res.status(401)
            throw new Error('User not authorized')
           
     }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true,})

    res.status(200).json(updatedGoal)
}
)


// delete goals

const deleteGoals = asyncHandler( async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if (!goal){
        res.status(400)
        throw new Error('Goal not found');
    }
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
         //logged in user matches the goal user
     if(goal.user.toString() !== user.id){
          res.status(401)
          throw new Error('User not authorized')
         
   }
     await Goal.remove()
    res.status(200).json({id:req.params.id})
})


module.exports = {getGoals, setGoals, updateGoals, deleteGoals
}