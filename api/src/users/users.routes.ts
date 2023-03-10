import Router from 'express-promise-router';
import { Response, Request } from 'express';
import UsersController from "./users.controller";
import * as PermissionMiddleware from '../common/middlewares/auth.permission.middleware';
import * as ValidationMiddleware from '../common/middlewares/auth.validation.middleware';

import { UserRole } from './users.models';
import { createResponse } from '../common/response';

const router = Router();

router.post('/register', [UsersController.insert]);

router.get('/id/:userId', [
  ValidationMiddleware.requireValidJwt,
  UsersController.getById
]);

router.get('/username/:username', [
  ValidationMiddleware.requireValidJwt,
  PermissionMiddleware.allowOnlySameUserOrAdmin,
  UsersController.getByUsername
]);

router.patch('/id/:userId', [
  ValidationMiddleware.requireValidJwt,
  PermissionMiddleware.allowOnlySameUserOrAdmin,
  UsersController.patchById
]);

router.delete('/id/:userId', [
  ValidationMiddleware.requireValidJwt,
  PermissionMiddleware.requiresSpecificRole([UserRole.ADMIN]),
  PermissionMiddleware.disallowSameUser,
  UsersController.removeById
]);

router.all('/', (req: Request, res: Response) => {
  res.status(404).send(createResponse(404, '', null));
});

router.all('*', (req: Request, res: Response) => {
  res.status(404).send(createResponse(404, '', null));
});

export default router;
