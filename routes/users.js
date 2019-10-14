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
  // console.log(req)
  let updatedUser = await User.findOneAndUpdate(req.body.user._id, req.body.user.tasks, {new: true})
  // let updatedTask = await Task.findOneAndUpdate(req.body.task._id, req.body.task, {new:true})
  res.json(updatedUser).send();
  // .catch(err=> err.send());
})

router.post("/register", (req, res, next) => {

  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({email: req.body.email}).then(user => {
    if(user) {
      return res.status(400).json({email: "Email is already in use"});
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
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

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email}).then(user => {
    if(!user){
      return res.status(404).json({namenotfound : "Email not found"});
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
            res.json({
              success: true,
              token: "Bearer" + token,
              user: user
            });
          }
        );
      } else {
        return res.status(400).json({passwordincorrect: "Password Incorrect"});
      }
    });
  });
});

module.exports = router;
