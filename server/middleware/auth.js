// middleware/verifyToken.js
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  // Option 1: From service account JSON file (recommended for production)
  const serviceAccount = require("../firebase-service-account.json"); // Adjust path

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // Option 2: From environment variables (alternative, less common)
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //   }),
  // });
}

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied: No token provided or invalid format',
      });
    }

    const token = authHeader.split(' ')[1].trim();

    if (!token) {
      return res.status(401).json({ message: 'Access denied: Token is missing' });
    }

    // === Verify Firebase ID Token ===
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,              // Firebase unique ID
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      provider: decodedToken.firebase?.sign_in_provider || 'unknown',
      firebase: decodedToken.firebase,
    };

    // Optional: You can link this uid to your own DB user here

    next(); // Success
  } catch (error) {
    console.error('Firebase Auth Error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.code?.startsWith('auth/')) {
      return res.status(401).json({ message: 'Invalid Firebase token' });
    }

    return res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = verifyToken;