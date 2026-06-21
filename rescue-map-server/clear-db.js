const { db } = require('./config/firebase');

const deleteCollection = async (collectionPath) => {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    return 0;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  return snapshot.size;
};

const clearData = async () => {
  try {
    console.log('Clearing Firestore database...');
    
    const deletedVictims = await deleteCollection('victims');
    console.log(`Deleted ${deletedVictims} victims from Firestore.`);
    
    const deletedVolunteers = await deleteCollection('volunteers');
    console.log(`Deleted ${deletedVolunteers} volunteers from Firestore.`);
    
    console.log('Database cleared successfully');
    process.exit(0);
  } catch (err) {
    console.error('Clearing database failed:', err);
    process.exit(1);
  }
};

clearData();
