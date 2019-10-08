const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const User = require("../models/users")
const Task = require("../models/tasks");

router.post("/add", (req,res) => {
  let errors = {}
  if(isEmpty(req.body.name)){
    errors.name = "The task requires a name";
  }
  if(isEmpty(req.body.user_id)){
    errors.user_id = "The task has no user_id";
  }
  if(!isEmpty(errors)){
    return res.status(400).json(errors);
  } else {
    const newTask = new Task({
      name: req.body.name,
      user_id: req.body.user_id,
    })
    User.findOne({_id:newTask.user_id}).then(user => {
      if(!user){
        return res.status(404).json({usernotfound: "user not found!"})
      }
      user.tasks.push(newTask._id);
      user.save();
    })
    newTask.save()
    .then(task => res.json(task))
    .catch(err => console.log(err))
  }
})
module.exports = router;
