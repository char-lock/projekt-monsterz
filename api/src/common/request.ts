import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface IJwtRequest extends Request {
  jwt?: jwt.JwtPayload;
}
