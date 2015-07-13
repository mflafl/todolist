
// model/TodoItem.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

var TodoItemSchema = new Schema({
  revisions: [{
      type: Schema.Types.ObjectId,
      ref: 'TodoItemRevision'
    }
  ],
  tagRefs: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  title: String,
  body: String,
  done: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  doneAt: Date,
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

TodoItemSchema.path('done').set(function(newVal) {
  var originalVal = this.done;
  if (originalVal === false && newVal === true) {
    this.markedAsDone = true;
  }
  return newVal;
});

TodoItemSchema.pre('save', function(next) {
  now = new Date();
  this.updated = now;
  if (this.markedAsDone) {
    this.doneAt = now;
  }
  next();
})

TodoItemSchema.virtual('version').get(function() {
  return this.revisions[this.revisions.length - 1];
});

TodoItemSchema.virtual('tags').get(function() {
  var result = [];  
  _.each(this.tagRefs, function(item) {
    if (item.name) {
      // id string dont have name property
      result.push(item._id);
    } else {
      result.push(item);
    }
  });
  return result
});

TodoItemSchema.virtual('tagsPlain').get(function() {
  var result = [];
  _.each(this.tagRefs, function(item) {
    if (item.name) {
      result.push(item.name);
    }
  });
  return result;
});

module.exports = mongoose.model('TodoItem', TodoItemSchema);

