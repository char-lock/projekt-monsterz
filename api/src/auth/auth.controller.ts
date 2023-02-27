import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { defaultServerError, defaultSuccess } from '../common/models/response.model';
import ApiLogger from '../common/logger';

import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}..${path.sep}.env`) });
const jwtSecret = process.env.JWT_SECRET;

interface IJwtRequest extends Request {
  jwt?: jwt.JwtPayload;
}

export const login = (req: Request, res: Response) => {
  try {
    const refreshId = `${req.body.userId}${jwtSecret}`;
    // ApiLogger.info(`refreshId -> ${refreshId}`);
    const salt = crypto.randomBytes(16).toString('base64');
    // ApiLogger.info(`salt -> ${salt}`);
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
    // ApiLogger.info(`hash -> ${hash}`);
    req.body.refreshKey = salt;
    const token = jwt.sign(req.body, jwtSecret);
    // ApiLogger.info(`token -> ${token}`);
    const tokenBuffer = Buffer.from(hash);
    const refreshToken = tokenBuffer.toString('base64');
    // ApiLogger.info(`refreshToken -> ${refreshToken}`);
    // ApiLogger.info('Made it through the login processes');
    return res.status(201).send(defaultSuccess({accessToken: token, refreshToken: refreshToken}));
  } catch (err) {
    return res.status(500).send(defaultServerError({ errors: err }, ''));
  }
};

export const refreshToken = (req: IJwtRequest, res: Response) => {
  try {
    req.body = req.jwt;
    const token = jwt.sign(req.body, jwtSecret);
    return res.status(200).send(defaultSuccess({ token: token }));
  } catch (err) {
    return res.status(500).send(defaultServerError({ errors: err }, ''));
  }
};
