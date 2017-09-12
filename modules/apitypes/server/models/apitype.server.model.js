'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Apitype Schema
 */
var ApitypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Apitype name',
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

mongoose.model('Apitype', ApitypeSchema);
