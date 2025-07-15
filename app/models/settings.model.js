const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
    required: true,
  },
  settingData: Object,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Settings = mongoose.model('Settings', settingsSchema)
module.exports = Settings;
