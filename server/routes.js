/**
 * Main application routes
 */

'use strict';
var _ = require('lodash');
var errors = require('./components/errors');
var path = require('path');
var multer = require('multer');
var fs = require('fs-extra');
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

module.exports = function(app) {
  var id = '';
  var photoPath = '';
  // Insert routes below
  app.use('/api/photos', require('./api/photo'));
  app.use('/api/articles', require('./api/article'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.post('/api/photos', upload.any(), function (req, res, next)  {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
    console.log('files: ' + JSON.stringify(req.files));
    console.log('body:' + JSON.stringify(req.body));
    res.writeHead(200, { 'Connection': 'close' });
    res.end("");
    id = req.body.uuid;
    photoPath = req.files[0].destination + '\\' + id;
    console.log('Path: ' + photoPath);

    fs.mkdirs(photoPath, function(err) {
      if (err) {
        return console.error(err);
      }

    });
    _.forEach(req.files, function(f) {
      fs.move(f.path, f.destination + '\\' + id + '\\' + f.originalname, function(err) {
        if (err) {
          return console.error(err);
        }
      });
    });

  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
