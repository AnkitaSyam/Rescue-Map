const mongoose = require('mongoose');
const Victim = require('./models/Victim');
const Volunteer = require('./models/Volunteer');

const MONGO_URI = 'mongodb://localhost:27017/rescuemap';

const dummyVictims = [
  {
    name: 'Sarah Parker',
    severity: 'Critical',
    peopleCount: 4,
    description: 'Trapped on the roof of a flooded house. Water levels still rising.',
    location: { lat: 40.7128, lng: -74.0060 },
    priorityScore: 95
  },
  {
    name: 'Elderly Couple',
    severity: 'Trapped',
    peopleCount: 2,
    description: 'Door is stuck due to debris. No electricity or heat.',
    location: { lat: 40.7306, lng: -73.9352 },
    priorityScore: 82
  },
  {
    name: 'Injured Group',
    severity: 'Injured',
    peopleCount: 3,
    description: 'Minor cuts and bruises. Need medical supplies and food.',
    location: { lat: 40.7589, lng: -73.9851 },
    priorityScore: 65
  },
  {
    name: 'Safe Neighborhood',
    severity: 'Safe',
    peopleCount: 15,
    description: 'Relocation center set up, but running low on drinking water.',
    location: { lat: 40.7851, lng: -73.9683 },
    priorityScore: 35
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Victim.deleteMany({});
    await Volunteer.deleteMany({});
    
    await Victim.insertMany(dummyVictims);
    console.log('Seed data inserted successfully');
    
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
