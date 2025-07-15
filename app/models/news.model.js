const mongoose = require('mongoose')
const slugify = require('slugify')

const newsSchema = new mongoose.Schema({
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
  order: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true
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

newsSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = Date.now();
  next();
})
const News = mongoose.model('News', newsSchema)
module.exports = News;