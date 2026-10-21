require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const validateProductionConfig = () => {
  if (process.env.NODE_ENV !== 'production') return;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters in production.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured in production.');
  }
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL must be configured in production.');
  }
};

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Avoid blocking Vite local dev resources
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Allow localhost origins only during development and tests.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalOrigin =
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);
      if (
        allowedOrigins.includes(origin) ||
        isLocalOrigin ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      const error = new Error('CORS origin not allowed');
      error.status = 403;
      return callback(error);
    },
    credentials: true, // Allow cookies to be sent across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
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

app.get('/api/ready', (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;
  res.status(isDatabaseConnected ? 200 : 503).json({
    status: isDatabaseConnected ? 'ready' : 'not_ready',
    database: isDatabaseConnected ? 'connected' : 'disconnected',
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
    validateProductionConfig();
    await connectDB();
    if (process.env.NODE_ENV !== 'test') {
      const server = app.listen(PORT, () => {
        console.log(`[Server] VisaPath API running on http://localhost:${PORT}`);
        console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`[Notice] DEMO — NOT AN OFFICIAL IMMIGRATION SERVICE`);
      });

      const shutdown = (signal) => {
        console.log(`[Server] ${signal} received; shutting down gracefully.`);
        server.close(async (error) => {
          if (error) {
            console.error('[Server Error] HTTP server shutdown failed:', error.message);
            process.exitCode = 1;
          }
          try {
            await mongoose.disconnect();
          } catch (disconnectError) {
            console.error('[Database Error] MongoDB shutdown failed:', disconnectError.message);
            process.exitCode = 1;
          }
        });
      };

      process.once('SIGTERM', () => shutdown('SIGTERM'));
      process.once('SIGINT', () => shutdown('SIGINT'));
    }
  } catch (err) {
    console.error('[Server Error] Startup failed:', err.message);
    process.exitCode = 1;
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
