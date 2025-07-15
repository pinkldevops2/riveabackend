const mongoose = require('mongoose')

const caseStudyCategoriesSchema = new mongoose.Schema({
  typeId: {
    type: String,
    required: true,
  },
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

const CaseStudyCategories = mongoose.model('CaseStudyCategories', caseStudyCategoriesSchema)
module.exports = CaseStudyCategories;