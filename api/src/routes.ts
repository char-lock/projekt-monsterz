import Router from 'express-promise-router';

import monsters from './monsters/monsters.routes';
import users from './users/users.routes';
import auth from './auth/auth.routes';
import lessons from './lessons/lessons.routes';
import { defaultSuccess } from './common/models/response.model';

const routes = Router();

routes.all('/', (req, res) => { res.status(200).send(defaultSuccess(null)); });

routes.use('/monsters', monsters);
routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/lessons', lessons);

export default routes;
