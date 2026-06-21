const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { analyzeDistress } = require('../services/aiService');

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

// POST Create Victim Report (Distress)
router.post('/victims', async (req, res) => {
  const { name, phone, location, severity, peopleCount, description, media } = req.body;
  
  try {
    let priorityScore = calculatePriority(severity, peopleCount, new Date());
    let aiReasoning = '';

    // Integrate Gemini AI Triage
    const aiResult = await analyzeDistress(description);
    if (aiResult) {
      priorityScore = Math.max(priorityScore, aiResult.priorityScore);
      aiReasoning = aiResult.reasoning;
      console.log(`AI Triage: Priority ${aiResult.priorityScore}, Severity: ${aiResult.verifiedSeverity}`);
    }
    
    const victimData = {
      name: name || 'Anonymous',
      phone,
      location,
      severity: severity || 'Safe',
      peopleCount: peopleCount || 1,
      description,
      media: media || [],
      status: 'Pending',
      priorityScore: Number(priorityScore),
      aiReasoning,
      assignedTeam: null,
      assignedVolunteer: null,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('victims').add(victimData);
    const savedVictim = { _id: docRef.id, ...victimData };
    
    // Emit real-time update to all coordinators via socket.io
    const io = req.app.get('socketio');
    io.emit('new-emergency', savedVictim);
    
    res.status(201).json({ success: true, victim: savedVictim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET All Active Victims (exclude Rescued and Closed)
router.get('/victims', async (req, res) => {
  try {
    const snapshot = await db.collection('victims')
      .where('status', 'not-in', ['Closed', 'Rescued'])
      .get();
    
    let victims = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    
    // Populate assignedVolunteer manually
    for (let victim of victims) {
      if (victim.assignedVolunteer) {
        const volDoc = await db.collection('volunteers').doc(victim.assignedVolunteer).get();
        if (volDoc.exists) {
          const volData = volDoc.data();
          delete volData.password;
          victim.assignedVolunteer = { _id: volDoc.id, ...volData };
        } else {
          victim.assignedVolunteer = null;
        }
      }
    }
    
    // Sort by priorityScore desc in memory to avoid index requirements
    victims.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
    
    res.json(victims);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH Update Victim Status
router.patch('/victims/:id', async (req, res) => {
  const { status, assignedTeam } = req.body;
  
  try {
    const docRef = db.collection('victims').doc(req.params.id);
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (assignedTeam !== undefined) updateData.assignedTeam = assignedTeam;
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    if (!updatedDoc.exists) {
      return res.status(404).json({ success: false, error: 'Victim not found' });
    }
    
    const victim = { _id: updatedDoc.id, ...updatedDoc.data() };
    
    // Populate assignedVolunteer
    if (victim.assignedVolunteer) {
      const volDoc = await db.collection('volunteers').doc(victim.assignedVolunteer).get();
      if (volDoc.exists) {
        const volData = volDoc.data();
        delete volData.password;
        victim.assignedVolunteer = { _id: volDoc.id, ...volData };
      } else {
        victim.assignedVolunteer = null;
      }
    }
    
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

// POST Register Volunteer
router.post('/volunteers/register', async (req, res) => {
  const { name, phone, password, dob, skills, location } = req.body;
  try {
    if (!name || !phone || !password || !dob) {
      return res.status(400).json({ success: false, error: 'Name, phone, password and date of birth are required.' });
    }

    // Calculate age from DOB and enforce 18+
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) age--;

    if (age < 18) {
      return res.status(400).json({ success: false, error: 'You must be 18 or older to register as a volunteer.' });
    }

    const snapshot = await db.collection('volunteers').where('phone', '==', phone).limit(1).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, error: 'Phone already registered. Please login.' });
    }

    const volunteerData = {
      name,
      phone,
      password,
      dob: dobDate.toISOString(),
      skills: skills || [],
      location: location || { lat: 0, lng: 0 },
      available: true,
      activeTasks: [],
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('volunteers').add(volunteerData);
    
    const safe = {
      _id: docRef.id,
      name,
      phone,
      dob: volunteerData.dob,
      skills: volunteerData.skills,
      location: volunteerData.location,
      available: volunteerData.available,
      activeTasks: volunteerData.activeTasks,
      createdAt: volunteerData.createdAt,
      age
    };
    
    res.status(201).json({ success: true, volunteer: safe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Login Volunteer (phone + password)
router.post('/volunteers/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password) return res.status(400).json({ success: false, error: 'Phone and password are required.' });
    
    const snapshot = await db.collection('volunteers').where('phone', '==', phone).limit(1).get();
    if (snapshot.empty) {
      return res.status(404).json({ success: false, error: 'No account found with this phone number.' });
    }
    
    const doc = snapshot.docs[0];
    const volunteer = { _id: doc.id, ...doc.data() };
    
    if (volunteer.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }
    
    // Populate activeTasks
    const populatedTasks = [];
    if (volunteer.activeTasks && volunteer.activeTasks.length > 0) {
      for (const taskId of volunteer.activeTasks) {
        const taskDoc = await db.collection('victims').doc(taskId).get();
        if (taskDoc.exists) {
          populatedTasks.push({ _id: taskDoc.id, ...taskDoc.data() });
        }
      }
    }
    volunteer.activeTasks = populatedTasks;
    
    const safe = { ...volunteer };
    delete safe.password;
    
    res.json({ success: true, volunteer: safe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Assign victim to volunteer (En Route)
router.post('/volunteers/:id/assign/:victimId', async (req, res) => {
  try {
    const volRef = db.collection('volunteers').doc(req.params.id);
    const volDoc = await volRef.get();
    if (!volDoc.exists) return res.status(404).json({ success: false, error: 'Volunteer not found' });
    
    const volunteerData = volDoc.data();
    let activeTasks = volunteerData.activeTasks || [];
    if (!activeTasks.includes(req.params.victimId)) {
      activeTasks.push(req.params.victimId);
      await volRef.update({ activeTasks });
    }

    const victimRef = db.collection('victims').doc(req.params.victimId);
    await victimRef.update({
      status: 'Dispatched',
      assignedVolunteer: req.params.id
    });
    
    const updatedVictimDoc = await victimRef.get();
    const victim = { _id: updatedVictimDoc.id, ...updatedVictimDoc.data() };
    
    // Populate assignedVolunteer
    const volDocPopulated = await volRef.get();
    const volData = volDocPopulated.data();
    delete volData.password;
    victim.assignedVolunteer = { _id: volDocPopulated.id, ...volData };
    
    // Prepare safe volunteer data
    const volunteer = { _id: volDocPopulated.id, ...volData, activeTasks };

    const io = req.app.get('socketio');
    io.emit('status-update', victim);

    res.json({ success: true, volunteer, victim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Volunteer with active tasks populated
router.get('/volunteers/:id', async (req, res) => {
  try {
    const volDoc = await db.collection('volunteers').doc(req.params.id).get();
    if (!volDoc.exists) return res.status(404).json({ success: false, error: 'Volunteer not found' });
    
    const volunteer = { _id: volDoc.id, ...volDoc.data() };
    delete volunteer.password;
    
    // Populate activeTasks
    const populatedTasks = [];
    if (volunteer.activeTasks && volunteer.activeTasks.length > 0) {
      for (const taskId of volunteer.activeTasks) {
        const taskDoc = await db.collection('victims').doc(taskId).get();
        if (taskDoc.exists) {
          populatedTasks.push({ _id: taskDoc.id, ...taskDoc.data() });
        }
      }
    }
    volunteer.activeTasks = populatedTasks;
    
    res.json({ success: true, volunteer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
