import {
  CategoryEntity,
  CreateCategoryDto,
  PaginationDto,
  CustomError,
  UserEntity,
} from '../../domain';
import { CategoryModel } from '../../data';
import { envs } from '../../config/envs';
import { ProductService } from './product.service';

export class CategoryService {
  //DI
  constructor(
    private readonly productService: ProductService,
  ) {}

  async getCategories(pagination: PaginationDto): Promise<any> {
    const { limit, page } = pagination;

    try {
      const total = CategoryModel.countDocuments();
      const response = CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit);

      const [totalCategories, categories] = await Promise.all([
        total,
        response,
      ]);

      return {
        page,
        limit,
        total: totalCategories,
        next:( totalCategories - page * limit) > 0 ? `${envs.WEBSERVICE_URL}/categories?page=${
          page + 1
        }&limit=${limit}` : null, 
        prev:
          page - 1 > 0
            ? `${envs.WEBSERVICE_URL}/categories?page=${
                page - 1
              }&limit=${limit}`
            : null,
        categories: categories.map(CategoryEntity.fromObject),
      };
    } catch (error) {
      throw CustomError.internalServer(`Error getting categories: ${error}`);
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto, 
    user: UserEntity
  ): Promise<CategoryEntity> {
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`Error creating category: ${error}`);
    }
  }

  async updateCategory(
    id: string,
    createCategoryDto: CreateCategoryDto, 
    user: UserEntity
  ): Promise<CategoryEntity> {
    const categoryExists = await CategoryModel.findById(id).exec();

    if (!categoryExists) throw CustomError.badRequest('Category does not exists');

    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { ...createCategoryDto, user: user.id },
        {
          new: true,
        }
      );

      if (!category) throw CustomError.badRequest('Category update failed');

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`Error creating category: ${error}`);
    }
  }

  async deleteCategory(id: string, user: UserEntity): Promise<any> {
    const categoryExists = await CategoryModel.findById(id).exec();

    if(!categoryExists) throw CustomError.badRequest('Category does not exists');

    try {
      //find category "undefined" in database. If it does not exist create it
      let categoryUndefined = await CategoryModel.findOne({name: 'undefined'}).exec();

      

      if(!categoryUndefined){
  
        categoryUndefined = new CategoryModel({
          name: 'undefined',
          available: false,
          user: user.id
        });
        await categoryUndefined.save();
      }
  
      //get all products with category id and set category to undefined previously defined
      //TODO: ERROR here
      const products = await this.productService.updateProductsCategory(id, categoryUndefined.id);

      //delete category
      await CategoryModel.findByIdAndDelete(id).exec();

      return {
        message: 'Category deleted successfully and products set to undefined',
      }
      
    } catch (error) {
      throw CustomError.internalServer(`Error deleting category: ${error}`);
    }
  }
}
