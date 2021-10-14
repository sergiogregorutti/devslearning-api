const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
 
const courseSchema = new mongoose.Schema(
  {
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
    pricing: {
      type: String,
      enum : ['free','one-time-payment', 'subscription'],
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      max: 32,
      default: 0
    },
    category: {
      type: ObjectId,
      ref: 'Category'
    },
    photo: {
      data: Buffer,
      contentType: String
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('Course', courseSchema);
