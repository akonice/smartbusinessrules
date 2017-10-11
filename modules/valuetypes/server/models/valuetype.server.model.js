'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
mongooseHistory = require('mongoose-history'),
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
  },
  host : {
    type: String
  }
});

var options = {indexes: [{'t': -1, 'd._id': 1}]};
ValuetypeSchema.plugin(mongooseHistory, options);
mongoose.model('Valuetype', ValuetypeSchema);
