import { CreateProductDto, CustomError, ProductEntity } from '../../domain';
import { ProductModel } from '../../data';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { envs } from '../../config';

export class ProductService {
  //DI
  constructor() {}
  async getProducts(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'name email')
          .populate('category', 'name'),
      ]);

      return {
        page,
        limit,
        total,
        next:
          total - page * limit > 0
            ? `${envs.WEBSERVICE_URL}/products?page=${page + 1}&limit=${limit}`
            : null,
        prev:
          page - 1 > 0
            ? `${envs.WEBSERVICE_URL}/products?page=${page - 1}&limit=${limit}`
            : null,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServer(`Error getting products: ${error}`);
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    });

    if (productExists) throw CustomError.badRequest('Product already exists');

    try {
      const product = new ProductModel(createProductDto);

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`Error creating product: ${error}`);
    }
  }

  async updateProduct(id: string, updateProductDto: CreateProductDto) {
    const productExists = await ProductModel.findById(id).exec();

    if (!productExists) throw CustomError.badRequest('Product does not exists');

    try {
      const product = await ProductModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
        }
      );

      return product;
    } catch (error) {
      throw CustomError.internalServer(`Error creating product: ${error}`);
    }
  }

  async updateProductsCategory(oldCategoryId: string, newCategoryId: string) {
   console.log(oldCategoryId, newCategoryId);
    try {
     const products = await ProductModel.updateMany(
        { category: oldCategoryId },
        { $set: { category: newCategoryId } }
      );

      return products;
    } catch (error) {
      throw CustomError.internalServer(`Error updating products category: ${error}`);
    }
  }

  async deleteProduct(id: string) {
    const productExists = await ProductModel.findById(id).exec();

    if (!productExists) throw CustomError.badRequest('Product does not exists');

    try {
        const product = await ProductModel.findByIdAndDelete(id);

        return {
            message: 'Product deleted',
            product
        }
    } catch (error) {
        throw CustomError.internalServer(`Error deleting product: ${error}`);
    }
  }
}
