import { Request, Response } from 'express';
import { CustomError, PaginationDto, CreateProductDto, DeleteProductDto } from '../../domain/';
import { ProductService } from '../services';

export class ProductController {
  //: DI
  constructor(private readonly productService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`[ERROR] ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    this.productService
      .getProducts(paginationDto!)
      .then((products) => {
        res.json(products);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json({ error });

    this.productService
      .createProduct(createProductDto!)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  updateProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, createProductDto] = CreateProductDto.create({
        ...req.body,
        user: req.body.user.id,
        id
      });
    if (error) return res.status(400).json({ error });
    
    this.productService
      .updateProduct(id, createProductDto!)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  deleteProduct = (req: Request, res: Response) => {
    const [error, id] = DeleteProductDto.delete(req.params);

    if (error) return res.status(400).json({ error });

    this.productService
      .deleteProduct(id!)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        this.handleError(error, res);
      });

  };


}
