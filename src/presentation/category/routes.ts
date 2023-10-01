import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';


export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    // Define your routes here
    router.get('/', controller.getCategories);
    router.post('/',[AuthMiddleware.validateJWT], controller.createCategory);
    router.put('/:id', controller.updateCategory);
    router.delete('/:id', controller.deleteCategory);

    return router;
  }
}