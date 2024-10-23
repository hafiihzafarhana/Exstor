import express, { Router } from 'express';

import { ItemControllers } from '../controllers/item_controller';
import TokenMiddleware from '../middlewares/token_middleware';
import { upload } from '../utils/multer_util';
const router: Router = express.Router();

const itemControllers = new ItemControllers();
const tokenMiddleware = new TokenMiddleware();

export function itemRoutes(): Router {
  router.post('/items/create-file', tokenMiddleware.authenticate, itemControllers.createFile);
  router.post('/items/create-folder', tokenMiddleware.authenticate, itemControllers.createFolder);
  router.put('/items/update-name', tokenMiddleware.authenticate, itemControllers.update);
  router.delete('/items/:id', tokenMiddleware.authenticate, itemControllers.delete);
  router.post('/items/bulk/delete', tokenMiddleware.authenticate, itemControllers.bulkDelete);
  router.get('/items/root', tokenMiddleware.authenticate, itemControllers.getAllRoot);
  router.get('/items/:id', tokenMiddleware.authenticate, itemControllers.getAll);
  router.get('/items/open/:id', tokenMiddleware.authenticate, itemControllers.openFile);
  router.post('/items/upload/multer', upload.single('file'), tokenMiddleware.authenticate, itemControllers.uploadFile);
  router.post('/items/copy-here', tokenMiddleware.authenticate, itemControllers.copyHere);
  router.post('/items/copy-paste', tokenMiddleware.authenticate, itemControllers.copyPath);
  return router;
}
