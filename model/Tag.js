// model/Tag.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Tag', TagSchema);