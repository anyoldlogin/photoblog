'use strict';

var _ = require('lodash');
var Article = require('./article.model');

// Get list of articles
exports.index = function(req, res) {
  var query = req.query
  Article.find()
  .populate('author')
  .exec(function (err, article) {
    console.log("in index");
    Article.find(function (err, articles) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(articles);
    });
  });
};

// Get list visible of articles
exports.visible = function(req, res) {
  console.log('got to visible');
  var query = req.query
  Article.findOne({'isHidden' : 'false'})

  .populate('author')
  .exec(function (err, article) {
    console.log("in visible");
    Article.find(function (err, articles) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(articles);
    });
  });
};
// Get a single article
exports.show = function(req, res) {
  Article.findById(req.params.id)
    .populate('author')
    .exec(function (err, article) {
      if(err) { return handleError(res, err); }
      if(!article) {
        return res.status(404).send('Not Found');
      }
      else {
        console.log("got:" + JSON.stringify(article));
      }
      return res.json(article);
    });
};

// Creates a new article in the DB.
exports.create = function(req, res) {
  Article.create(req.body, function(err, article) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(article);
  });
};

// Updates an existing article in the DB.
exports.update = function(req, res) {
  console.log("In rest update method");
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.status(404).send('Not Found'); }
    var updated = _.merge(article, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(article);
    });
  });
};

// Deletes a article from the DB.
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.status(404).send('Not Found'); }
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
