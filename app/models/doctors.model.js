const mongoose = require('mongoose')

const doctorsListSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
  },
  degree: {
    type: String,
  },
  profile_picture: {
    type: String,
  },
  speciality: {
    type: String,
  },
  languages: {
    type: String,
  },
  gender: {
    type: String,
  },
  description: {
    type: String,
  },
  longDescription: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
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

const DoctorsList = module.exports = mongoose.model('DoctorsList', doctorsListSchema)
module.exports = DoctorsList;