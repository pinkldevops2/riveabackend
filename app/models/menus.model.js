const mongoose = require('mongoose')
const slugify = require('slugify')

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique:false,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  url: {
    type: String,
    unique: false,
    trim: true,
  },
  location: {
    type: String,
    required: [true,'Please add content']
  },
  targetWindow: {
    type: Boolean,
    default: false
  },
  targetColumn: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
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
menuSchema.index({ isActive: 1 })

const Menus = module.exports = mongoose.model('Menu', menuSchema)
module.exports = Menus;