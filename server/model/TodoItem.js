// model/TodoItem.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoItemSchema = new Schema({
  revisions: [{type: Schema.Types.ObjectId, ref: 'TodoItemRevision'}],
  title: String,
  body: String,
  done: {type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: Date,
  doneAt: Date,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

TodoItemSchema.pre('save', function(next) {
  now = new Date();
  this.updated = now;
  if (this.done) {
    this.doneAt = now;
  }
  next();
});

TodoItemSchema.virtual('version').get(function() {
  return this.revisions[this.revisions.length - 1];
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);