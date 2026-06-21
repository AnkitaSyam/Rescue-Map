const { initializeApp, cert, applicationDefault } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let db;

try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    let serviceAccount;
    const trimmed = serviceAccountKey.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      // Parse JSON string directly
      serviceAccount = JSON.parse(trimmed);
    } else {
      // Resolve path
      const absolutePath = path.isAbsolute(trimmed)
        ? trimmed
        : path.resolve(__dirname, '..', trimmed);
      serviceAccount = require(absolutePath);
    }

    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized with Service Account Key.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault()
    });
    console.log('Firebase Admin SDK initialized with Application Default Credentials.');
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({
      projectId: 'rescue-map'
    });
    console.log('Firebase Admin SDK initialized for Firestore Emulator.');
  } else {
    throw new Error(
      'Missing FIREBASE_SERVICE_ACCOUNT_KEY in environment configuration. ' +
      'Please check your .env file.'
    );
  }

  db = getFirestore();
  // Safe handling of undefined object fields in Firestore
  db.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error('Firebase Initialization Error:', error.message);
  process.exit(1);
}

module.exports = { db };
