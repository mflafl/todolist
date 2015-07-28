var TodoItem = require('../../model/TodoItem/TodoItem');
var TodoItemRevision = require('../../model/TodoItem/TodoItemRevision');
var Tag = require('../../model/Tag');
var _ = require('underscore');
var async = require('async');
var express = require('express');

var router = express.Router();
router.route('/items')

.post(function(req, res) {
  var item = new TodoItem();
  item.title = req.body.item.title;
  item.body = req.body.item.body;
  item.category = req.body.item.category;

  item.save(function(err) {
    if (err)
      res.send(err);

    res.json({
      item: item
    });
  });
})
  .get(function(req, res) {
  TodoItem.find().populate('tagRefs').exec(function(err, items) {
    if (err)
      res.send(err);
    res.json({
      items: items,
    });
  });
});

router.route('/items/:item_id')

.get(function(req, res) {
  TodoItem.findById(req.params.item_id).populate('tagRefs')
    .exec(function(err, item) {
    if (err) res.send(err);
    res.json({
      item: item,
    });
  });
})

.put(function(req, res) {
  // use our item model to find the item we want
  TodoItem.findById(req.params.item_id)
  //.populate('tagRefs')
  .exec(function(err, item) {
    if (err) res.send(err);

    item.tagRefs = [];
    var tagsPlain = req.body.item.tagsPlain;

    async.forEach(tagsPlain, function(tagName, callback) {
      Tag.findOne({
        name: tagName
      }, function(err, doc) {
        if (err) res.send(err);

        if (doc) {
          item.tagRefs.push(doc.id);
          callback();
        } else {
          var tag = new Tag();
          tag.name = tagName;

          tag.save(function(err) {
            if (err) res.send(err);
            item.tagRefs.push(tag.id);
            callback();
          });
        }
      });
    }, function(err) {
      if (err) return next(err);

      item.title = req.body.item.title;
      item.body = req.body.item.body;
      item.done = req.body.item.done;
      item.category = req.body.item.category;

      async.parallel([
        function(callback) { //This is the second task, and callback is its callback task
          if (item.isModified('title') || item.isModified('body')) {
            var itemRevision = new TodoItemRevision();
            itemRevision.title = item.title;
            itemRevision.body = item.body;
            itemRevision.item = item.id;

            itemRevision.save(function(err) {
              if (err) res.send(err);
              item.revisions.push(itemRevision.id);
              callback();
            });
          } else {
            callback();
          }
        }
      ], function(err) {
        if (err) res.send(err);

        item.save(function(err) {
          if (err) res.send(err);

          TodoItem.findById(req.params.item_id)
            .populate('tagRefs')
            .exec(function(err, item) {
            if (err) res.send(err);
            res.json({
              item: item
            });

          });
        });
      });
    });
  });
})

.delete(function(req, res) {
  TodoItem.remove({
    _id: req.params.item_id
  }, function(err, item) {
    if (err) res.send(err);
    res.status(204).end();
  });
});

module.exports = router