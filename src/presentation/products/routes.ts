import { Router } from 'express';
import { ProductController } from './controller';
import { ProductService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    //: Define your services and controllers here
    const productService = new ProductService();
    const controller = new ProductController(productService);

    //: Define your routes here
    router.get('/', controller.getProducts);
    router.post('/',[AuthMiddleware.validateJWT], controller.createProduct);
    router.put('/:id',[AuthMiddleware.validateJWT], controller.updateProduct);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteProduct);

    return router;
  }
}
