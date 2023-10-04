import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService, ProductService } from '../services';


export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const productService = new ProductService();
    const categoryService = new CategoryService(productService);
    const controller = new CategoryController(categoryService);

    // Define your routes here
    router.get('/', controller.getCategories);
    router.post('/',[AuthMiddleware.validateJWT], controller.createCategory);
    router.put('/:id',[AuthMiddleware.validateJWT], controller.updateCategory);
    router.delete('/:id',[AuthMiddleware.validateJWT], controller.deleteCategory);

    return router;
  }
}