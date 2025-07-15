const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Gallery = mongoose.model('Gallery', gallerySchema)
module.exports = Gallery;