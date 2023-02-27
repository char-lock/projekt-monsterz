import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { defaultBadRequest } from '../models/response.model';
import ApiLogger from '../logger';

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}..${path.sep}..${path.sep}.env`)});
const jwtSecret = process.env.JWT_SECRET;

interface IJwtRequest extends Request {
  jwt?: jwt.JwtPayload;
}

export const verifyRefreshBodyField = (req: Request, res: Response, next: NextFunction) => {
  ApiLogger.info('Recent request requires refreshToken field in the body - verifying ...');
  if (req.body && req.body.refreshToken) {
    ApiLogger.info('Required field is present - passing request to next method ...');
    return next();
  }
  ApiLogger.warn('Required field is missing - sending error status ...');
  return res.status(400).send(defaultBadRequest('\'refreshToken\' field required'));
};

export const requireValidRefresh = (req: IJwtRequest, res: Response, next: NextFunction) => {
  ApiLogger.info('Recent request requires a valid refreshToken - verifiying ...');
  const tokenBuffer = Buffer.from(req.body.refreshToken, 'base64');
  const refreshToken = tokenBuffer.toString();
  const hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(`${req.jwt.userId}${jwtSecret}`).digest('base64');
  if (hash === refreshToken) {
    req.body = req.jwt;
    ApiLogger.info('Refresh token is valid - passing request to next method ...');
    return next();
  }
  ApiLogger.warn('Refresh token is invalid - sending error status ...');
  return res.status(400).send(defaultBadRequest('Invalid refresh token'));
};

export const requireValidJwt = (req: IJwtRequest, res: Response, next: NextFunction) => {
  ApiLogger.info('A recent request requires a valid JWT in the request header - verifying ...');
  if (req.headers['authorization']) {
    ApiLogger.info('Authorization field present in the request header - checking format ...');
    try {
      const authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        ApiLogger.warn('Authorization token is either invalid or missing - sending error status ...');
        return res.status(401).send();
      } else {
        ApiLogger.info('Detected proper bearer token in authorization header - verifying JWT validity ...');
        req.jwt = jwt.verify(authorization[1], jwtSecret) as jwt.JwtPayload;
        ApiLogger.info('Provided bearer token is valid - passing request to the next method ...');
        return next();
      }
    } catch (err) {
      ApiLogger.warn('Encountered an error while attempting to verify JWT - sending error status ...');
      return res.status(403).send();
    }
  }
  ApiLogger.warn('Unable to verify JWT - sending error status ...');
  return res.status(401).send();
};
