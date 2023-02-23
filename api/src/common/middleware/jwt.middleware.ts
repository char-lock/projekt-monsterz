import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

/** Validates a JWT and provides a refreshed token. */
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Grab the JWT from the request headers.
  const jwToken = <string>req.headers['auth'];
  let jwtPayload;
  // Validate the token and pull data.
  try {
    jwtPayload = <any>jwt.verify(jwToken, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // If token is not valid, respond with 401 (Unauthorized)
    res.status(401).send();
    return;
  }
  // A token is only valid for an hour at a time; a new token should be provided
  // with each new request.
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.setHeader('token', newToken);
  // Call the next middleware or controller.
  next();
};
