const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
 
const courseSchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    description: {
      type: String,
      required: true,
      max: 2000
    },
    platform: {
      type: String,
      max: 2000
    },
    author: {
      type: String,
      max: 2000
    },
    pricing: {
      type: String,
      enum : ['free','one-time-payment', 'subscription'],
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      max: 9999,
      default: 0
    },
    year: {
      type: Number,
      trim: true
    },
    category: {
      type: ObjectId,
      ref: 'CategoryEs'
    },
    link: {
      type: String,
      trim: true,
      required: true,
      max: 2000
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('CourseEs', courseSchema);
