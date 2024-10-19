import express, { Router } from 'express';

import { UserControllers } from '../controllers/user_controller';
const router: Router = express.Router();

const userControllers = new UserControllers();

export function userRoutes(): Router {
  router.post('/users/sign-up', userControllers.create);
  router.post('/users/sign-in', userControllers.login);
  return router;
}
