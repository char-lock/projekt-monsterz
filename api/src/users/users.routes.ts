import Router from 'express-promise-router';
import UsersController from './users.controller';

const router = Router();

// User -> Get User
router.get('/:userId', UsersController.getUser);

// User -> Add User
router.post('/add', UsersController.postUser);

export default router;
