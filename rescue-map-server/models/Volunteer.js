const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  skills: [{ type: String }],
  available: { type: Boolean, default: true },
  activeTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Victim' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
