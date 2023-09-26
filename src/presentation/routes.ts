import { Router } from 'express';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    //TODO: Define your routes here
    router.get('/', (req, res) => {
      res.send('Hello Benito!');
    });

    return router;
  }
}
