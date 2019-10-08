const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {type: String, required: true},
  user_id: {type: String, required: true},
  date: {type: Date, default: Date.now},
  isLarger: {type: Boolean, default: false},
  comments: {type: Array, default: []},
  subtasks: {type: Array, default: []},
  subTaskOf: {type: String, default: null},
})

module.exports = Task = mongoose.model("tasks", TaskSchema);
