'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  comments: [{

    comment: String,
    createdAt: Date()
  }]
  createdAt: Date()
});

module.exports = mongoose.model('Article', ArticleSchema);
