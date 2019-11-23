const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const Task = require("../models/tasks")
const User = require("../models/users");

// @route POST api/users/register
// @desc Register user
// @ access Public

router.put("/update", async (req, res, next) => {
  // if necessary rework this
  // Task.findbyId(req.body.task._id).then(task => {
  //   task = req.body.task;
  //   task.save()
  //   res.send(task)
  // }).catch(err=>console.log(err))
  // to here...
  User.findById(req.body.updatedUser._id).then(user =>{
    user.tasks = req.body.updatedUser.tasks
    // let completed = user.tasks.filter(x => x.completed===true)
    // console.log(completed)
    user.save( function(err) {
    if(err) {
      console.log(err)
      return next(err);
    }
    res.send({
      body: user,
    });
  })
    // user.update(req.body.updatedUser)
    // .then(returnedUser => {
    //   return res.send(returnedUser)
    // })
    // .catch(err=>console.log(err))
  });
})

router.delete("/delete", (req, res, next) => {
  console.log(req.body._id)
  User.deleteOne({_id: req.body._id})
  .then(res.json({message:"deleted!"}).send())
  .catch(res.json({message: "error!"}).send())
})


router.post("/register", (req, res, next) => {

  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({name: req.body.name}).then(user => {
    if(user) {
      return res.status(400).json({name: "name is already in use"});
    } else {
      const newUser = new User({
        name: req.body.name,
        // name: req.body.name,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => {
            res.json({user:user})
            return res.send();
          })
          .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);

  if(!isValid){
    return res.status(400).json
  }

  const name = req.body.name;
  const password = req.body.password;

  User.findOne({name}).then(user => {
    if(!user){
      return res.status(404).json({namenotfound : "name not found"});
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if(isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          secret.secretOrKey,
          {
            expiresIn: 315569296
          },
          (err, token) => {
            if(err){
              return next(err);
            }
            if(user.isAdmin===true){
              User.find({}).then(docs => {
                res.json({
                  allUsers: docs,
                  success: true,
                  token: "Bearer" + token,
                  user: user
                });
              }).catch(err => console.log(err))
            } else {
              res.json({
                success: true,
                token: "Bearer" + token,
                user: user
              });
            }
          }
        );
      } else {
        return res.status(400).json({passwordincorrect: "Password Incorrect"});
      }
    });
  });
});

module.exports = router;
