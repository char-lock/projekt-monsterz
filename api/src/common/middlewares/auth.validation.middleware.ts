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
  if (req.body && req.body.refreshToken) {
    return next();
  }
  return res.status(400).send(defaultBadRequest('\'refreshToken\' field required'));
};

export const requireValidRefresh = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const tokenBuffer = Buffer.from(req.body.refreshToken, 'base64');
  const refreshToken = tokenBuffer.toString();
  const hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(`${req.jwt.userId}${jwtSecret}`).digest('base64');
  if (hash === refreshToken) {
    req.body = req.jwt;
    return next();
  }
  return res.status(400).send(defaultBadRequest('Invalid refresh token'));
};

export const requireValidJwt = (req: IJwtRequest, res: Response, next: NextFunction) => {
  if (req.headers['authorization']) {
    try {
      const authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        // ApiLogger.info('Bearer token not present in authorization header');
        return res.status(401).send();
      } else {
        // ApiLogger.info('verifying token ' + authorization[1]);
        req.jwt = jwt.verify(authorization[1], jwtSecret) as jwt.JwtPayload;
        // ApiLogger.info(JSON.stringify(req.jwt));
        return next();
      }
    } catch (err) {
      return res.status(403).send();
    }
  }
  return res.status(401).send();
};
