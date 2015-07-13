var Tag = require('../../model/Tag');

var express = require('express');
var router = express.Router();

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