'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  mongooseHistory = require('mongoose-history'),
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
  },
  host : {
    type: String
  }

});




var options = {indexes: [{'t': -1, 'd._id': 1}]};
ApitypeSchema.plugin(mongooseHistory, options);
mongoose.model('Apitype', ApitypeSchema);
//ApitypeSchema.plugin(mongooseHistory)