import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    sub: string;
    email?: string;
    [key: string]: unknown;
  };
}

const userPoolId = process.env['COGNITO_USER_POOL_ID'];
const region = process.env['AWS_REGION'] ?? 'us-east-1';

if (!userPoolId) {
  throw new Error('COGNITO_USER_POOL_ID environment variable is required');
}

const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

const client = jwksClient({
  jwksUri: `${issuer}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
  if (!header.kid) {
    callback(new Error('No kid in token header'));
    return;
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer,
      },
      (err, decoded) => {
        if (err) {
          next(new UnauthorizedError(`Invalid token: ${err.message}`));
          return;
        }

        if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
          next(new UnauthorizedError('Invalid token payload'));
          return;
        }

        req.userId = decoded.sub as string;
        req.user = decoded as {
          sub: string;
          email?: string;
          [key: string]: unknown;
        };
        next();
      }
    );
  } catch (error) {
    next(error);
  }
}
