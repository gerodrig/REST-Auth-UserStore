import {
  CategoryEntity,
  CreateCategoryDto,
  PaginationDto,
  CustomError,
  UserEntity,
} from '../../domain';
import { CategoryModel } from '../../data';
import { envs } from '../../config/envs';

export class CategoryService {
  //DI
  constructor() {}

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
}
