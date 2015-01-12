// model/TodoItem.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoItemSchema = new Schema({
  title: String,
  body: String,
  done: {type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: Date,
  doneAt: Date,
});

TodoItemSchema.pre('save', function(next) {
  now = new Date();
  this.updated = now;
  if (this.done) {
    this.doneAt = now;
  }
  next();
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);