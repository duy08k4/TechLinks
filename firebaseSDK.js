const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const dotenv = require("dotenv")

dotenv.config()

// const serviceAccount = require(process.env.FIREBASE_API_KEY);
const serviceAccount = JSON.parse(process.env.FIREBASE_API_KEY);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = { db, FieldValue };