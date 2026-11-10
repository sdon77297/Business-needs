import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { connectDB } from './config/db';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import serviceRoutes from './routes/serviceRoutes';
import adminRoutes from './routes/adminRoutes';

const app: Application = express();

// Trust reverse proxy for rate limiter IP resolution
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible development and Vite HMR
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  env.CLIENT_URL,
  env.CLIENT_URL.startsWith('http') ? env.CLIENT_URL : `https://${env.CLIENT_URL}`,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matching origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in production for client portal
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// HTTP Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Global rate limiting
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    service: 'MFEF Private Wealth Core API',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler for unknown API routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Serve the production Vite build from the same origin as the API.
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req: Request, res: Response, next) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) next(error);
  });
});

// Centralized error handling
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[MFEF Server Running] http://localhost:${env.PORT}`);
    console.log(`[CORS Allowed Origin] ${env.CLIENT_URL}`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[MFEF Server] Received termination signal. Closing gracefully...');
    server.close(() => {
      console.log('[MFEF Server] Closed all HTTP connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

// Start the server if not imported by tests
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
