const mongoose = require('mongoose')
const slugify = require('slugify')

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique:true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
  },
  page_template: {
    type: String,
  },
  template_data: {
    type: Object
  },
  metaTitle: {
    type: String,
    maxlength: [70, 'Meta title cannot be more than 70 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta title cannot be more than 160 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHomePage: {
    type: Boolean,
    default: false
  },
  isFooterAnimationTemplate: {
    type: Boolean,
    default: false
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


pageSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = Date.now();
  next();
})
pageSchema.pre('deleteOne', {document: true, query: false}, async function(next){
  console.log(`Deleting content blocks from page ${this._id}`)
  next()
})

pageSchema.index({ isActive: 1 })
pageSchema.index({ isHomePage: 1 })

const Pages = module.exports = mongoose.model('Page', pageSchema)
module.exports = Pages;