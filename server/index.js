// server.js or app.js
const express = require('express');
const multer  = require('multer')
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const shroudRoutes = require('./routes/Routes.js');
require('dotenv').config();

// Initialize Express
const app = express();

// Environment variables
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in .env file');
  process.exit(1);
}

// === CORS Configuration ===

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from Vite dev server
    if (!origin || origin.startsWith('http://localhost:5173')) {
      return callback(null, true);
    }
    // In production: only allow your actual domain
    if (process.env.NODE_ENV === 'production') {
      if (origin === 'https://your-production-frontend.com') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
    // For local testing, allow all (remove in production!)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// === Security & Logging ===
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust as needed for your frontend
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(morgan('combined'));

// === Body Parsing ===
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// === Serve Static Assets (Development Only) ===
if (process.env.NODE_ENV !== 'production') {
  const assetsPath = path.join(__dirname, 'public', 'assets');
  app.use('/assets', express.static(assetsPath));
  console.log('Serving static assets from:', assetsPath);
}

// === Routes ===
// server.js - change this line
app.use('/clothing/v1', shroudRoutes);  // ← instead of /shroud/v1

// === 404 Handler ===
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// === Global Error Handler (Catches Multer, Cloudinary, etc.) ===
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large (max 10MB)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      default:
        message = err.message;
    }
    return res.status(400).json({ error: message });
  }

  // Cloudinary or validation errors
  if (err.message?.includes('Cloudinary')) {
    return res.status(400).json({ error: 'Image upload failed' });
  }

  // General server errors
  res.status(500).json({
    error: 'Internal server error',
    // Remove details in production
    ...(process.env.NODE_ENV !== 'production' && { details: err.message })
  });
});

// === Database Connection & Server Start ===
async function connectToDatabase() {
  try {
    await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  await connectToDatabase();
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`API Base URL: http://localhost:${port}/shroud/v1`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();