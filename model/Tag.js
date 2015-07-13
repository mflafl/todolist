
// model/Tag.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  name: String,
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Tag', TagSchema);