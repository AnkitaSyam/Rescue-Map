const express = require('express');
const router = express.Router();
const Victim = require('../models/Victim');
const Volunteer = require('../models/Volunteer');

// Calculate Priority Score Utility
const calculatePriority = (severity, people, timeSince) => {
  const severityPoints = {
    'Critical': 100,
    'Trapped': 80,
    'Injured': 60,
    'Safe': 20
  };
  
  // Weights: Severity (50%), People (30%), Time (20%)
  const severityScore = (severityPoints[severity] || 0) * 0.5;
  const peopleScore = Math.min(people * 10, 30); // Max 30 points for people
  
  // Time points: 1 point per 5 minutes since alert, max 20
  const minutesSince = Math.floor((Date.now() - new Date(timeSince).getTime()) / 60000);
  const timeScore = Math.min(Math.floor(minutesSince / 5), 20);
  
  return severityScore + peopleScore + timeScore;
};

// POST Report Distress
router.post('/report', async (req, res) => {
  const { name, phone, location, severity, peopleCount, description, media } = req.body;
  
  try {
    const priorityScore = calculatePriority(severity, peopleCount, new Date());
    
    const newVictim = new Victim({
      name, phone, location, severity, peopleCount, description, media, priorityScore
    });
    
    await newVictim.save();
    
    // Emit real-time update to all coordinators via socket.io
    const io = req.app.get('socketio');
    io.emit('new-emergency', newVictim);
    
    res.status(201).json({ success: true, victim: newVictim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET All Active Victims
router.get('/victims', async (req, res) => {
  try {
    const victims = await Victim.find({ status: { $ne: 'Closed' } }).sort({ priorityScore: -1 });
    res.json(victims);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH Update Victim Status
router.patch('/victims/:id', async (req, res) => {
  const { status, assignedTeam } = req.body;
  
  try {
    const victim = await Victim.findByIdAndUpdate(req.params.id, { status, assignedTeam }, { new: true });
    
    const io = req.app.get('socketio');
    io.emit('status-update', victim);
    
    res.json({ success: true, victim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Broadcast Alerts
router.post('/broadcast', async (req, res) => {
  const { title, message, radius, center } = req.body;
  
  try {
    const io = req.app.get('socketio');
    io.emit('emergency-broadcast', { title, message, radius, center, timestamp: new Date() });
    res.json({ success: true, message: 'Broadcast sent' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
