const { db } = require('./config/firebase');

const dummyVictims = [
  {
    name: 'Rahul Kumar',
    phone: '9876543210',
    location: { lat: 10.0158, lng: 76.3418, address: 'Kakkanad, Kochi' },
    severity: 'Critical',
    peopleCount: 4,
    description: 'Flash flood entered the ground floor. 4 people trapped on roof. Elderly person needs medical help.',
    media: [],
    status: 'Pending',
    priorityScore: 85,
    assignedTeam: null,
    assignedVolunteer: null,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Anjali Sharma',
    phone: '8765432109',
    location: { lat: 9.9816, lng: 76.2999, address: 'Edappally, Kochi' },
    severity: 'Injured',
    peopleCount: 2,
    description: 'Wall collapsed. 1 person has a leg injury and cannot walk. Water levels rising.',
    media: [],
    status: 'Pending',
    priorityScore: 70,
    assignedTeam: null,
    assignedVolunteer: null,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Anonymous',
    phone: '7654321098',
    location: { lat: 10.0261, lng: 76.3084, address: 'Kalamassery, Kochi' },
    severity: 'Safe',
    peopleCount: 1,
    description: 'Blocked road due to fallen trees, need assistance clearing to get supplies.',
    media: [],
    status: 'Pending',
    priorityScore: 30,
    assignedTeam: null,
    assignedVolunteer: null,
    createdAt: new Date().toISOString()
  }
];

const dummyVolunteers = [
  {
    name: 'Amal Dev',
    phone: '9000000001',
    password: 'password123',
    dob: '1998-05-15T00:00:00.000Z',
    skills: ['First Aid', 'Swimming', 'Debris Clearing'],
    location: { lat: 9.9816, lng: 76.2999 },
    available: true,
    activeTasks: [],
    createdAt: new Date().toISOString()
  }
];

const seedData = async () => {
  try {
    console.log('Seeding Firestore database...');
    
    // Clear first
    const collections = ['victims', 'volunteers'];
    for (const coll of collections) {
      const snapshot = await db.collection(coll).get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`Cleared collection: ${coll}`);
      }
    }
    
    // Seed victims
    for (const victim of dummyVictims) {
      await db.collection('victims').add(victim);
    }
    console.log(`Successfully seeded ${dummyVictims.length} victims.`);

    // Seed volunteers
    for (const volunteer of dummyVolunteers) {
      await db.collection('volunteers').add(volunteer);
    }
    console.log(`Successfully seeded ${dummyVolunteers.length} volunteers.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
