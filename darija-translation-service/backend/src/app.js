import express from 'express';
import corsMiddleware from './middlewares/cors.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(corsMiddleware);

// API routes
app.use('/', routes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware 
app.use(errorMiddleware);

export default app;
