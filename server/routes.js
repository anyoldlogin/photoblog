/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/assets/photos');
    },
    filename: function (req, file, cb) {
      console.log('file: ' + JSON.stringify(file));
        cb(null, file.originalname);
  }
});
var upload = multer({storage: storage});

module.exports = function(app) {

  // Insert routes below
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
