const mongoose = require('mongoose')
const slugify = require('slugify')

const caseStudiesSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
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
    typeId: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

caseStudiesSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = Date.now();
  next();
})

const CaseStudies = mongoose.model('CaseStudies', caseStudiesSchema)
module.exports = CaseStudies;