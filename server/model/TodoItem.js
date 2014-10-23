// model/TodoItem.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TodoItemSchema = new Schema({
	name: String
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);