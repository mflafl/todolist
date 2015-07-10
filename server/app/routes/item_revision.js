var TodoItemRevision = require('../../model/TodoItem/TodoItemRevision');

var express = require('express');
var router = express.Router();

router.route('/items/:item_id/revisions')

.get(function(req, res) {
    TodoItemRevision.find({
        item: req.params.item_id
    }).sort({
        'created': -1
    })
        .exec(function(err, items) {
        if (err)
            res.send(err);
        res.json(items);
    });
})

router.route('/items/revision/:revision_id')

.get(function(req, res) {
    TodoItemRevision.findById(req.params.revision_id, function(err, item) {
        if (err)
            res.send(err);
        res.json(item);
    });
})

module.exports = router