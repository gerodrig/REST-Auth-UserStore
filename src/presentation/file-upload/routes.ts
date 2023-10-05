import { Router } from 'express';
import { FileUploadController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadService } from '../services';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';


export class FileUploadRoutes {

    static get routes() {
        const router = Router();

        const controller = new FileUploadController( new FileUploadService());

        router.use(AuthMiddleware.validateJWT);
        router.use(FileUploadMiddleware.containFiles);
        router.use(TypeMiddleware.validTypes(['users', 'products', 'categories']));
        //? Define routes
        //api/upload/single/<user|product|category>
        //api/upload/multiple/<user|product|category>
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);

        return router;
    }
}