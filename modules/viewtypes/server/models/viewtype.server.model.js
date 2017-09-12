'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Viewtype Schema
 */
var ViewtypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Viewtype name',
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

mongoose.model('Viewtype', ViewtypeSchema);
