import { NextFunction, Response } from 'express';
import { IJwtRequest } from '../request';
import { UserRole } from '../../users/users.models';
import ApiLogger from '../logger';
import { createResponse } from '../response';


export const requiresSpecificRole = (allowedRoles: UserRole[]) => {
  return (req: IJwtRequest, res: Response, next: NextFunction) => {
    const currentRole = req.jwt.role;
    if (allowedRoles.indexOf(currentRole) !== -1) {
      return next();
    } else {
      return res.status(403).send(createResponse(403, '', null));
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
  return res.status(403).send(createResponse(403, '', null));
};

export const disallowSameUser = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const userId = req.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  }
  return res.status(400).send(createResponse(400, '', null));
};
