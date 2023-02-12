import { MonstersController } from './controllers/monsters.controller';
import { PermissionMiddleware } from '../common/middlewares/auth.permission.middleware';
import { ValidationMiddleware } from '../common/middlewares/auth.validation.middleware';

import { permissionLevels } from '../common/env.config';

/** Configures Express for routing related to the /monsters endpoint. */
exports.routesConfig = (app) => {
  app.get('/monsters', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(permissionLevels.SITE),
    MonstersController.list
  ]);

  app.get('/monsters/:monsterId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(permissionLevels.SITE),
    MonstersController.getById
  ]);
}
