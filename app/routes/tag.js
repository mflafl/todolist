var Tag = require('../../model/Tag');

var express = require('express');
var router = express.Router();

router.route('/tags/:tag_id')

// get the item with that id (accessed at GET http://localhost:8080/api/items/:item_id)
.get(function(req, res) {
  Tag.findById(req.params.tag_id)
    .exec(function(err, tag) {
    if (err) res.send(err);
    res.json({
      tag: tag,
    });
  });
})

router.route('/tags')
  .get(function(req, res) {
  Tag.find(function(err, items) {
    if (err)
      res.send(err);
    res.json({
      tags: items,
    });
  });
});

module.exports = router