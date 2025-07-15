const mongoose = require('mongoose')

const newsCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const NewsCategories = mongoose.model('NewsCategories', newsCategoriesSchema)
module.exports = NewsCategories;