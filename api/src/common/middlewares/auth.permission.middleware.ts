import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../../users/users.model';
import ApiLogger from '../logger';

interface IJwtRequest extends Request {
  jwt: jwt.JwtPayload;
}

export const requiresSpecificRole = (allowedRoles: UserRole[]) => {
  return (req: IJwtRequest, res: Response, next: NextFunction) => {
    const currentRole = req.jwt.role;
    if (allowedRoles.indexOf(currentRole) !== -1) {
      return next();
    } else {
      return res.status(403).send();
    }
  };
};

export const allowOnlySameUserOrAdmin = (req: IJwtRequest, res: Response, next: NextFunction) => {
  ApiLogger.info('A recent request can only be executed by the user or an administrator - verifying ...');
  const userRole = req.jwt.role;
  const userId = req.jwt.userId;
  const username = req.jwt.username;
  if (req.params && req.params.userId && userId === req.params.userId) {
    ApiLogger.info('Request made by the same user - passing request to the next method ...');
    return next();
  }
  if (req.params && req.params.username && username === req.params.username) {
    ApiLogger.info('Request made by the same user - passing request to the next method ...');
    return next();
  }
  if (userRole === UserRole.ADMIN) {
    ApiLogger.info('Request made by an administrator - passing request to the next method ...');
    return next();
  }
  ApiLogger.warn('Could not verify requestor is same user or an administrator - sending error status ...');
  return res.status(403).send();
};

export const disallowSameUser = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const userId = req.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  }
  return res.status(400).send();
};
