const mongoose = require('mongoose')

const caseStudyTypesSchema = new mongoose.Schema({
  type: {
    type: String,
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
  storyTitle: {
    type: String,
  },
  storyButton: {
    type: Object,
  },
  storyButton2: {
    type: Object,
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

const CaseStudyTypes = mongoose.model('CaseStudyTypes', caseStudyTypesSchema)
module.exports = CaseStudyTypes;