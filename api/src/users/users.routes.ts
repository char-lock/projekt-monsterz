import Router from 'express-promise-router';
import UsersController from './users.controller';

const router = Router();

// User -> Get User By ID
router.get('/id/:userId', UsersController.getUserById);
// User -> Get User By Username
router.get('/username/:username', UsersController.getUserByUsername);
// User -> Create User
router.post('/register', UsersController.createUser);
// User -> Delete User
router.delete('/id/:userId', UsersController.deleteUser);
// User -> Edit User
router.patch('/id/:userId', UsersController.editUser);

export default router;
