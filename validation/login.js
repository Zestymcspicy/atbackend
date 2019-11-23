const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};


  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if(Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  // } else if (!Validator.isname(data.name)) {
  //   errors.name = "name is invalid";
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
