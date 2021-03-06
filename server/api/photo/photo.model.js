'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  title: String,
  caption: String,
  url: String,
  active: Boolean
});

module.exports = mongoose.model('Photo', PhotoSchema);
