'use strict';

var _ = require('lodash');
var Photo = require('./photo.model');
var fs = require('fs-extra');

// // Get list of photos
// exports.index = function(req, res) {
//   Photo.find(function (err, photos) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(photos);
//   });
// };
//
// // Get a single photo
// exports.show = function(req, res) {
//   Photo.findById(req.params.id, function (err, photo) {
//     if(err) { return handleError(res, err); }
//     if(!photo) { return res.status(404).send('Not Found'); }
//     return res.json(photo);
//   });
// };

// Creates a new photo in the DB.
exports.create = function(req, res) {
  var id = '';
  var photoPath = '';

  res.writeHead(200, {
    'Connection': 'close'
  });
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
};

// // Updates an existing photo in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Photo.findById(req.params.id, function (err, photo) {
//     if (err) { return handleError(res, err); }
//     if(!photo) { return res.status(404).send('Not Found'); }
//     var updated = _.merge(photo, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(photo);
//     });
//   });
// };
//
// // Deletes a photo from the DB.
// exports.destroy = function(req, res) {
//   Photo.findById(req.params.id, function (err, photo) {
//     if(err) { return handleError(res, err); }
//     if(!photo) { return res.status(404).send('Not Found'); }
//     photo.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}
