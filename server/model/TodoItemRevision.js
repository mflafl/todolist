// model/TodoItemRevision.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TodoItemRevisionSchema = new Schema({
  item: {type: Schema.Types.ObjectId, ref: 'TodoItem'},
  title: String,
  body: String,  
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TodoItemRevision', TodoItemRevisionSchema);