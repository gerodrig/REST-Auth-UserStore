import { Request, Response } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto, DeleteCategoryDto } from '../../domain/';
import { CategoryService } from '../services';
export class CategoryController {
  // DI
  constructor(private readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`[ERROR] ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });
    // get categories from database
    this.categoryService
      .getCategories(paginationDto!)
      .then((categories) => {
        res.json(categories);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  createCategory = async (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    // save category in database
    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then((category) => {
        res.status(201).json(category);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  updateCategory = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateCategoryDto] = CreateCategoryDto.create({
      ...req.body,
      id,
    });
    if (error) return res.status(400).json({ error });

    this.categoryService
      .updateCategory(id, updateCategoryDto!, req.body.user)
      .then((category) => {
        res.json(category);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  deleteCategory = (req: Request, res: Response) => {
    const [error, categoryId] = DeleteCategoryDto.delete( req.params);

    if (error) return res.status(400).json({ error });

    // delete category in database
    this.categoryService.deleteCategory(categoryId!, req.body.user).then((category) => {
      res.json(category);
    }).catch((error) => {
      this.handleError(error, res);
    });
  };
}
