const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: {
    latitude: Number,
    longitude: Number
  },
  mediaFiles: [String], // paths to uploaded files
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
