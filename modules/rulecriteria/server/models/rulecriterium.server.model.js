'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rulecriterium Schema
 */
var RulecriteriumSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Rulecriterium name',
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

mongoose.model('Rulecriterium', RulecriteriumSchema);
