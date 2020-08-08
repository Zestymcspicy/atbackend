const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {type: String, required: true},
  user_id: {type: String, required: true},
  user_name: {type: String},
  completed: {type: Boolean, default: false},
  date: {type: Date, default: Date.now},
  dueDate: Date,
  longTermGoal: Boolean,
  comments: {type: Array, default: []},
  subtasks: {type: Array, default: []},
  subTaskOf: {type: String, default: null},
})

module.exports = Task = mongoose.model("tasks", TaskSchema);
