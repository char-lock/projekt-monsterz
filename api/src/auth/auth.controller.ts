import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { createResponse } from '../common/response';
import ApiLogger from '../common/logger';

import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}..${path.sep}.env`) });
const jwtSecret = process.env.JWT_SECRET;

interface IJwtRequest extends Request {
  jwt?: jwt.JwtPayload;
}

export const login = (req: Request, res: Response) => {
  ApiLogger.info('Received a new login request - handling ...');
  try {
    const refreshId = `${req.body.userId}${jwtSecret}`;
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
    req.body.refreshKey = salt;
    const token = jwt.sign(req.body, jwtSecret);
    const tokenBuffer = Buffer.from(hash);
    const refreshToken = tokenBuffer.toString('base64');
    ApiLogger.info('Login request successfully handled.');
    return res.status(201).send(createResponse(201, '', {accessToken: token, refreshToken: refreshToken}));
  } catch (err) {
    ApiLogger.error(`An error was experienced while handling login request.\n${err}`);
    return res.status(500).send(createResponse(500, '', { errors: err }));
  }
};

export const refreshToken = (req: IJwtRequest, res: Response) => {
  ApiLogger.info('Received a new token refresh request - handling ...');
  try {
    req.body = req.jwt;
    const token = jwt.sign(req.body, jwtSecret);
    ApiLogger.info('Token refresh request successfully handled.');
    return res.status(200).send(createResponse(200, '', { token: token }));
  } catch (err) {
    ApiLogger.error(`An error was experienced while attempting to refresh an access token.\n${err}`);
    return res.status(500).send(createResponse(500, '', { errors: err }));
  }
};
