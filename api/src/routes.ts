import Router from 'express-promise-router';

import monsters from './monsters/monsters.routes';
import users from './users/users.routes';
import auth from './auth/auth.routes';
import lessons from './lessons/lessons.routes';
import { createResponse } from './common/response';

const routes = Router();

routes.all('/', (req, res) => { return res.status(200).send(createResponse(200, '', null)); });

routes.use('/monsters', monsters);
routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/lessons', lessons);

routes.all('*', (req, res) => { return res.status(404).send(createResponse(404, '', null)); });

export default routes;
