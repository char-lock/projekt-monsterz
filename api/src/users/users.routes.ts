import Router from 'express-promise-router';
import UserController from "./users.controller";
import * as PermissionMiddleware from '../common/middlewares/auth.permission.middleware';
import * as ValidationMiddleware from '../common/middlewares/auth.validation.middleware';

const router = Router();

router.post('/register', [UserController.insert]);
router.get('/id/:userId', [
  ValidationMiddleware.requireValidJwt,
  PermissionMiddleware.allowOnlySameUserOrAdmin,
  UserController.getById
]);
router.get('/username/:username', [
  ValidationMiddleware.requireValidJwt,
  PermissionMiddleware.allowOnlySameUserOrAdmin,
  UserController.getByUsername
]);
// router.patch
// router.delete

export default router;
