var config = require('./config/config.json');
var express = require('express');
var async = require('async');

var mongoose = require('mongoose');
mongoose.connect(config['db-url']); // connect to our database

var TodoItem = require('./model/TodoItem');

var app = express();
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.route('/items')

.post(function(req, res) {
    var item = new TodoItem(); // create a new instance of the TodoItem model
    item.name = req.body.name; // set the items name (comes from the request)

    // save the item and check for errors
    item.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'TodoItem created!'
        });
    });

})
.get(function(req, res) {
    TodoItem.find(function(err, items) {
        if (err)
            res.send(err);

        res.json(items);
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
        res.json(item);
    });
})

// update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
.put(function(req, res) {

    // use our item model to find the item we want
    TodoItem.findById(req.params.item_id, function(err, item) {

        if (err)
            res.send(err);

        item.name = req.body.name; // update the items info

        // save the item
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'TodoItem updated!'
            });
        });

    });
})

// delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
.delete(function(req, res) {
    TodoItem.remove({
        _id: req.params.item_id
    }, function(err, item) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});


router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

app.use('/api', router);

app.listen(config.port);
console.log('Magic happens on port ' + config.port);