
var config = require('./config/config.json');
var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');

var mongoose = require('mongoose');
mongoose.connect(config['db-url']); // connect to our database

var TodoItem = require('./model/TodoItem');
var TodoItemRevision = require('./model/TodoItemRevision');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');

    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        // allow CORS
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next(); // make sure we go to the next routes and don't stop here
    }
});

router.route('/items')

.post(function(req, res) {
    var item = new TodoItem(); // create a new instance of the TodoItem model
    item.title = req.body.item.title; // set the items name (comes from the request)
    item.body = req.body.item.body;

    // save the item and check for errors
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
            items: items
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
        res.json(item);
    });
})

// update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
.put(function(req, res) {
    // use our item model to find the item we want
    TodoItem.findById(req.params.item_id, function(err, item) {
        if (err)
            res.send(err);

        item.title = req.body.item.title; // update the items info
        item.body = req.body.item.body;
        item.done = req.body.item.done;

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

// delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
.delete(function(req, res) {
    TodoItem.remove({
        _id: req.params.item_id
    }, function(err, item) {
        if (err)
            res.send(err);

        res.status(204).end();
    });
});


router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

router.route('/items/revision/:revision_id')

// get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
.get(function(req, res) {
    TodoItemRevision.findById(req.params.revision_id, function(err, item) {
        if (err)
            res.send(err);
        res.json(item);
    });
})

app.use('/api/v1', router);

app.listen(config.port);
console.log('Server started at: ' + config.port);
