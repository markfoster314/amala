import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile.routes';
import { AppError } from './utils/errors';
import { requestLogger } from './middleware/request-logger.middleware';

export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request logging (before routes)
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/profile', profileRoutes);

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
    if (err instanceof AppError) {
      console.error(
        `[${new Date().toISOString()}] Error: ${err.code} - ${err.message}`,
        {
          statusCode: err.statusCode,
          path: req.originalUrl || req.url,
          method: req.method,
          stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined,
        }
      );
      res.status(err.statusCode).json({
        error: {
          message: err.message,
          code: err.code,
        },
      });
      return;
    }

    // Unexpected errors
    console.error(
      `[${new Date().toISOString()}] Unexpected error:`,
      {
        message: err.message,
        name: err.name,
        path: req.originalUrl || req.url,
        method: req.method,
        stack: err.stack,
      }
    );
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      error: {
        message: 'Route not found',
        code: 'NOT_FOUND',
      },
    });
  });

  return app;
}
