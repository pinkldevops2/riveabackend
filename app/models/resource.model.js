const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title cannot be more than 70 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta title cannot be more than 160 characters']
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
    unique: true
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
resourceSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = Date.now();
  next();
})
const Resource = mongoose.model('Resource', resourceSchema)
module.exports = Resource;