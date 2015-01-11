// model/TodoItem.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoItemSchema = new Schema({
  title: String,
  body: String,
  done: {type: Boolean, default: false }
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);