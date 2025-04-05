const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: String,
  description: String,
  severity: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  media: [
    {
      filename: String,
      path: String,
      mimetype: String
    }
  ],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // or true if you want to enforce auth
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Incident', incidentSchema);
