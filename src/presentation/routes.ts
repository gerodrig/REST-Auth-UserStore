import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth/controller';
export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    //TODO: Define your routes here
    router.use('/api/auth', AuthRoutes.routes);

    return router;
  }
}
