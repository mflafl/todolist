var TodoItem = require('../../model/TodoItem/TodoItem');
var TodoItemRevision = require('../../model/TodoItem/TodoItemRevision');
var Tag = require('../../model/Tag');

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
    TodoItem.find(function(err, items) {
        if (err)
            res.send(err);
        res.json({
            items: items,
        });
    });
});

// on routes that end in /items/:item_id
// ----------------------------------------------------
router.route('/items/:item_id')

// get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
.get(function(req, res) {
    TodoItem.findById(req.params.item_id, function(err, item) {
        if (err)
            res.send(err);
    });
})

// update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
.put(function(req, res) {
    // use our item model to find the item we want
    TodoItem.findById(req.params.item_id, function(err, item) {
        if (err)
            res.send(err);

        console.log(req.body.tag);

        item.title = req.body.item.title; // update the items info
        item.body = req.body.item.body;
        item.done = req.body.item.done;
        item.category = req.body.item.category;

        var itemRevision = new TodoItemRevision();
        itemRevision.title = item.title;
        itemRevision.body = item.body;
        itemRevision.item = item.id;

        if (item.isModified('title') || item.isModified('body')) {
            itemRevision.save(function(err) {
                if (err)
                    res.send(err);

                item.revisions.push(itemRevision.id);

                item.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({
                        item: item
                    });
                });
            });
        } else {
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    item: item
                });
            });
        }

    });
})

.delete(function(req, res) {
    TodoItem.remove({
        _id: req.params.item_id
    }, function(err, item) {
        if (err)
            res.send(err);

        res.status(204).end();
    });
});

module.exports = router