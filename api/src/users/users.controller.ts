import UserDataBus from "./users.data";
import * as crypto from 'crypto';
import { Request, Response } from "express";
import { UserRole } from "./users.model";
import { defaultCreated, defaultSuccess } from "../common/models/response.model";

export default class UserController {
  
  static insert = (req: Request, res: Response) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(req.body.authKey).digest('base64');
    req.body.authKey = `${salt}$${hash}`;
    if (req.body.role === UserRole.ADMIN) req.body.role = UserRole.INDIVIDUAL;
    UserDataBus.createUser(req.body).then((result) => {
      res.status(201).send(defaultCreated({ id: result.id }, 'User was successfully created'));
    });
  };

  static getById = (req: Request, res: Response) => {
    UserDataBus.findById(req.params.userId).then((result) => {
      res.status(200).send(defaultSuccess(result));
    });
  };

  static getByUsername = (req: Request, res: Response) => {
    UserDataBus.findByUsername(req.params.username).then((result) => {
      res.status(200).send(defaultSuccess(result));
    });
  }
  
  static patchById = (req: Request, res: Response) => {
    res.status(404).send();
    // TODO: Implement patch control
  };

  static removeById = (req: Request, res: Response) => {
    res.status(404).send();
    // TODO: Implement delete control
  };

}

