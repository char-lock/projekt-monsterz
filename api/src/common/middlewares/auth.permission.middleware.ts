import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../../users/users.model';

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
  const userRole = req.jwt.role;
  const userId = req.jwt.userId;
  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  } else if (userRole === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).send();
};

export const disallowSameUser = (req: IJwtRequest, res: Response, next: NextFunction) => {
  const userId = req.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  }
  return res.status(400).send();
};
