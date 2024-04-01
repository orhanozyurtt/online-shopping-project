import { Router } from 'express';
import userController from '../controller/user.js';

const routes = new Router();

routes.post('/register', userController.register);
routes.post('/login', userController.login);
routes.get('/logout', userController.logout);

export default routes;
