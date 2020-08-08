const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const User = require("../models/users")
const Task = require("../models/tasks");


router.post("/addmultiple", (req, res) => {
  User.findById(req.body.user_id).then(user => {
    function addTask(task, longTerm){
        const newTask = new Task({
          longTermGoal: longTerm,
          name: task,
          user_id: req.body.user_id,
          user_name: req.body.user_name
        })
        user.tasks.push(newTask);
        newTask.save()
        .then(() => console.log("success"))
        .catch(err => console.log(err))
      }
    if(req.body.weeklies!==[]){
      req.body.weeklies.forEach(x => addTask(x, false))
    }
    if(req.body.longTerms!==[]){
      req.body.longTerms.forEach(x => addTask(x, true))
    }
    user.save()
    .then(updatedUser => res.send(updatedUser))
    .catch(err => console.log(err))
  }).catch(err=> console.log(err))

})
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
      longTermGoal: req.body.longTermGoal,
      name: req.body.name,
      user_id: req.body.user_id,
      dueDate: req.body.dueDate
    })
    User.findOne({_id:newTask.user_id}).then(user => {
      if(!user){
        return res.status(404).json({usernotfound: "user not found!"})
      }
      user.tasks.push(newTask);
      user.save();
    })
    newTask.save()
    .then(task => res.json(task))
    .catch(err => console.log(err))
  }
})
module.exports = router;
