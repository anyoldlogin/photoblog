'use strict';

var express = require('express');
var controller = require('./photo.controller');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/assets/photos');
    },
    filename: function (req, file, cb) {
      console.log('req.body: ' + JSON.stringify(req.body));
        cb(null, file.originalname);
  }
});
var upload = multer({storage: storage});

var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
 router.post('/', upload.any(), controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
