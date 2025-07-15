const mongoose = require('mongoose')

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
  },
  department: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  message: {
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
})

const ContactForm = module.exports = mongoose.model('ContactForm', contactFormSchema)
module.exports = ContactForm;