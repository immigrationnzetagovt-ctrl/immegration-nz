require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Avoid blocking Vite local dev resources
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration for local frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // Allow any localhost / 127.0.0.1 port or explicit FRONTEND_URL
      if (
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
        origin === process.env.FRONTEND_URL ||
        process.env.NODE_ENV === 'test'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true, // Allow cookies to be sent across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    project: 'VisaPath Demo Portal',
    notice: 'DEMO — NOT AN OFFICIAL IMMIGRATION SERVICE',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`[Server] VisaPath API running on http://localhost:${PORT}`);
        console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`[Notice] DEMO — NOT AN OFFICIAL IMMIGRATION SERVICE`);
      });
    }
  } catch (err) {
    console.error('[Server Error] Server failed to start due to database error:', err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
