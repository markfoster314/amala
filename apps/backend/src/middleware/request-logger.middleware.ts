import type { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 * Logs incoming requests with method, URL, timestamp, and response status
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Log incoming request
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url}`
  );
  console.log(`  Headers:`, {
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type'],
    authorization: req.headers['authorization'] ? 'Bearer ***' : undefined,
  });

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`  Body:`, JSON.stringify(req.body, null, 2));
  }

  if (req.params && Object.keys(req.params).length > 0) {
    console.log(`  Params:`, req.params);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`  Query:`, req.query);
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}
