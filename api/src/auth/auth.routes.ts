import Router from 'express-promise-router';

import * as VerifyUserMiddleware from './auth.verify.middleware';
import * as AuthController from './auth.controller';
import * as AuthValidationMiddleware from '../common/middlewares/auth.validation.middleware';

const router = Router();

router.post('/token', [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.userAndKeyHasMatch,
  AuthController.login
]);

router.post('/refresh', [
  AuthValidationMiddleware.requireValidJwt,
  AuthValidationMiddleware.verifyRefreshBodyField,
  AuthValidationMiddleware.requireValidRefresh,
  AuthController.login
]);

export default router;
