'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  mongooseHistory = require('mongoose-history'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Project name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Project description',
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
  },
  userList : [{ type : ObjectId, ref: 'User' }]
  
});

var options = {indexes: [{'t': -1, 'd._id': 1}]};
ProjectSchema.plugin(mongooseHistory, options);
mongoose.model('Project', ProjectSchema);
