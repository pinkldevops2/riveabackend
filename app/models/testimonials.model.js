const mongoose = require('mongoose')

const testimonialsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  videoPoster: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  },
  categories: {
    type: [String],
    default: []
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

const Testimonial = mongoose.model('Testimonial', testimonialsSchema)
module.exports = Testimonial;