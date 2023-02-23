import { Request, Response } from 'express';
import Router from 'express-promise-router';

import monsters from './monsters/monsters.routes';
// import users from './users/users.routes';
// import auth from './auth/auth.routes';
// import lessons from './lessons/lessons.routes';

const routes = Router();

routes.use('/monsters', monsters);
// routes.use('/users', users);
// routes.use('/auth', auth);
// routes.use('/lessons', lessons);

export default routes;