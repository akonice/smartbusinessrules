'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Criteriatype Schema
 */
var CriteriatypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Criteriatype name',
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

mongoose.model('Criteriatype', CriteriatypeSchema);
