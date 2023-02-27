import * as crypto from 'crypto';
import { NextFunction, Request, Response } from "express";
import ApiLogger from '../common/logger';
import { defaultBadRequest, defaultNotExist } from "../common/models/response.model";
import UserDataBus from "../users/users.data";

export const hasAuthValidFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = [];
  if (req.body) {
    if (!req.body.username) errors.push('Missing username field');
    if (!req.body.authKey) errors.push('Missing authKey field');
    if (errors.length) return res.status(400).send(defaultBadRequest(errors.join('; ')));
    return next();
  }
  return res.status(400).send(defaultBadRequest('Missing username field; Missing authKey field'));
};

export const userAndKeyHasMatch = (req: Request, res: Response, next: NextFunction) => {
  UserDataBus.findByUsername(req.body.username).then((user) => {
    if (user.length < 1) {
      ApiLogger.info('No users found in userAndKeyHasMatch');
    }
    if (user.length < 1) return res.status(404).send(defaultNotExist('Unable to locate user with username'));
    const passwordFields = user[0].authKey.split('$');
    const salt = passwordFields[0];
    const hash = crypto.createHmac('sha512', salt).update(req.body.authKey).digest('base64');
    if (hash === passwordFields[1]) {
      req.body = {
        userId: user[0].id,
        username: user[0].username,
        role: user[0].role,
        verification: user[0].verification,
        provider: 'username'
      };
      return next();
    }
    return res.status(400).send(defaultBadRequest('Invalid username and/or password'));
  });
};
