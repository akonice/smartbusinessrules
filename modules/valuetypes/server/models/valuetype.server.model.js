'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Valuetype Schema
 */
var ValuetypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Valuetype name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Valuetype', ValuetypeSchema);
