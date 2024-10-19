import { Application } from 'express';

import { userRoutes } from './routes/user_route';
import { itemRoutes } from './routes/item_route';

const basePath = '/api/v1';
export function indexRoutes(app: Application): void {
  app.use(basePath, userRoutes());
  app.use(basePath, itemRoutes());
}
