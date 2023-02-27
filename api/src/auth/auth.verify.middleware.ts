import * as crypto from 'crypto';
import { NextFunction, Request, Response } from "express";
import ApiLogger from '../common/logger';
import { defaultBadRequest, defaultNotExist } from "../common/models/response.model";
import UserDataBus from "../users/users.data";

export const hasAuthValidFields = (req: Request, res: Response, next: NextFunction) => {
  ApiLogger.info('A recent request requires that the authorization fields are valid - verifying ...');
  const errors = [];
  if (req.body) {
    if (!req.body.username) {
      ApiLogger.warn('Request is missing a necessary authorization field: username');
      errors.push('Missing username field');
    }
    if (!req.body.authKey) {
      ApiLogger.warn('Request is missing a necessary authorization field: authKey');
      errors.push('Missing authKey field');
    }
    if (errors.length) {
      return res.status(400).send(defaultBadRequest(errors.join('; ')));
    }
    ApiLogger.info('Necessary authorization fields are present. Handing request to next function ...');
    return next();
  }
  ApiLogger.warn('Request body is undefined');
  return res.status(400).send(defaultBadRequest('Missing username field; Missing authKey field'));
};

export const userAndKeyHasMatch = (req: Request, res: Response, next: NextFunction) => {
  ApiLogger.info('A recent request requires a check that a user\'s authKey and username are correct - verifying ...');
  UserDataBus.findByUsername(req.body.username).then((user) => {
    if (user.length < 1) {
      ApiLogger.warn(`No user was able to be found with username '${req.body.username}'`);
      return res.status(404).send(defaultNotExist(
        `Unable to locate user with username '${req.body.username}'`));
    }
    const passwordFields = user[0].authKey.split('$');
    const salt = passwordFields[0];
    const hash = crypto.createHmac('sha512', salt).update(req.body.authKey).digest('base64');
    if (hash === passwordFields[1]) {
      ApiLogger.info('Known hash matches provided data.');
      req.body = {
        userId: user[0].id,
        username: user[0].username,
        role: user[0].role,
        verification: user[0].verification,
        provider: 'username'
      };
      ApiLogger.info('Passing request onto the next method ...');
      return next();
    }
    ApiLogger.info('Username and/or password does not match records.');
    return res.status(400).send(defaultBadRequest('Invalid username and/or password'));
  });
};
