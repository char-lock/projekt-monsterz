import UserDataBus from "./users.data";
import * as crypto from 'crypto';
import { Request, Response } from "express";
import { IUser, UserRole, IUserQuery } from "./users.models";
import { createResponse } from "../common/response";
import ApiLogger from "../common/logger";

export default class UsersController {
  
  static insert = (req: Request, res: Response) => {
    ApiLogger.info('Received user create/insert request - handling ...');
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(req.body.authKey).digest('base64');
    req.body.authKey = `${salt}$${hash}`;
    if (req.body.role === UserRole.ADMIN) {
      ApiLogger.warn('An attempt to create an Admin-level user was made - changing role as appropriate ...');
      req.body.role = UserRole.INDIVIDUAL;
    }
    UserDataBus.createUser(req.body).then((result) => {
      ApiLogger.info(`Successfully created user; User ID -> ${result.id}`);
      res.status(201).send(createResponse(201, 'User was successfully created', { id: result.id }));
    });
  };

  static getById = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to fetch user with ID '${req.params.userId}'`);
    UserDataBus.findById(req.params.userId).then((result) => {
      ApiLogger.info(`Found matching user; returning data ...`);
      result[0].authKey = undefined;
      res.status(200).send(createResponse(200, '', result));
    });
  };

  static getByUsername = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to fetch user with username '${req.params.username}'`);
    UserDataBus.findByUsername(req.params.username).then((result) => {
      ApiLogger.info(`Found matching user; returning data ...`);
      result[0].authKey = undefined;
      res.status(200).send(createResponse(200, '', result));
    });
  };
  
  static patchById = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to edit/patch user with ID '${req.params.userId}'`);
    const { userId } = req.params;
    const userChanges: IUserQuery = req.body;
    if (!userId || !userChanges) {
      ApiLogger.error('Request missing either baseline user ID or any changes -- sending error ...');
      return res.status(400).send(createResponse(400, 'Missing userId and/or changeable data not provided'));
    }
    return UserDataBus.findById(userId).then((rows) => {
      if (rows.length < 0) {
        ApiLogger.error('Requested user does not exist -- sending error ...');
        return res.status(400).send(createResponse(400, 'User does not exist'));
      }
      const userBase = rows[0];
      const userEdit: IUser = {
        id: userChanges.id ? userChanges.id : userBase.id,
        username: userChanges.username ? userChanges.username : userBase.username,
        authKey: userChanges.authKey ? userChanges.authKey : userBase.authKey,
        role: userChanges.role ? userChanges.role : userBase.role,
        verification: userChanges.verification ? {
          verified: userChanges.verification.verified ? userChanges.verification.verified : userBase.verification.verified,
          method: userChanges.verification.method ? userChanges.verification.method : userBase.verification.method,
          value: userChanges.verification.value ? userChanges.verification.value : userBase.verification.value
        } : userBase.verification
      };
      return UserDataBus.patchUser(userId, userEdit).then(() => {
        return res.status(200).send(createResponse(200, 'Successfully patched user', null));
      });
    });
  };

  static removeById = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to remove/delete user with ID '${req.params.userId}'`);
    const { userId } = req.params;
    if (!userId) return res.status(400).send(createResponse(400, 'User ID is required.'));
    return res.status(200).send(createResponse(200, 'Successfully deleted user.', UserDataBus.removeById(userId)));
  };

}
