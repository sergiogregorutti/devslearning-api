const mongoose = require('mongoose');
 
const categorySchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('Category', categorySchema);
