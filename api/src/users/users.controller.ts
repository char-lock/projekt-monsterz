import UserDataBus from "./users.data";
import * as crypto from 'crypto';
import { Request, Response } from "express";
import { UserRole } from "./users.model";
import { defaultCreated, defaultSuccess } from "../common/models/response.model";
import ApiLogger from "../common/logger";

export default class UserController {
  
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
      res.status(201).send(defaultCreated({ id: result.id }, 'User was successfully created'));
    });
  };

  static getById = (req: Request, res: Response) => {
    // It is theoretically impossible to call this function through the
    // API and not provide a user ID.
    ApiLogger.info(`Received request to fetch user with ID '${req.params.userId}'`);
    UserDataBus.findById(req.params.userId).then((result) => {
      ApiLogger.info(`Found matching user; returning data ...`);
      result[0].authKey = undefined;
      res.status(200).send(defaultSuccess(result));
    });
  };

  static getByUsername = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to fetch user with username '${req.params.username}'`);
    UserDataBus.findByUsername(req.params.username).then((result) => {
      ApiLogger.info(`Found matching user; returning data ...`);
      result[0].authKey = undefined;
      res.status(200).send(defaultSuccess(result));
    });
  }
  
  static patchById = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to edit/patch user with ID '${req.params.userId}'`);
    res.status(404).send();
    // TODO: Implement patch control
  };

  static removeById = (req: Request, res: Response) => {
    ApiLogger.info(`Received request to remove/delete user with ID '${req.params.userId}'`);
    res.status(404).send();
    // TODO: Implement delete control
  };

}
