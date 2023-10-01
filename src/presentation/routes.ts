import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    //: Define your routes here
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/categories', CategoryRoutes.routes);

    

    return router;
  }
}
