var config = require('./config/config.json');
var express = require('express');
var bodyParser = require('body-parser');

var itemRouter = require('./app/routes/item');
var itemRevisionRouter = require('./app/routes/item_revision');
var tagRouter = require('./app/routes/tag');
var categoryRouter = require('./app/routes/category');
var middleware = require('./app/routes/all');

var mongoose = require('mongoose');
mongoose.connect(config['db-url']);

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/api/v1', middleware);
app.use('/api/v1', itemRouter);
app.use('/api/v1', itemRevisionRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', tagRouter);

app.listen(config.port);
console.log('Server started at: ' + config.port);