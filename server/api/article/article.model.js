'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  isHidden: { type: Boolean, default: false },
  isMarkdown: { type: Boolean, default: false },
  images: [String],
  author: { type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
