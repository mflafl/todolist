var Category = require('../../model/Category');

var express = require('express');
var router = express.Router();

router.route('/categories')
    .post(function(req, res) {
    var item = new Category();
    item.title = req.body.category.title;
    item.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            category: item
        });
    });

})
    .get(function(req, res) {
    Category.find(function(err, items) {
        if (err)
            res.send(err);
        res.json({
            categories: items,
        });
    });
});

module.exports = router