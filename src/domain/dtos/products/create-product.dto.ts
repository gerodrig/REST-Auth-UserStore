import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly available: boolean,
    public readonly category: string, //ID
    public readonly user: string //ID
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, description, price, available, category, user } = object;

    if (!name) return ['Name is required'];
    if (!category) return ['Category is required'];
    if (!user) return ['User is required'];
    if(!Validators.isMongoId(category)) return ['Invalid category id'];
    if(!Validators.isMongoId(user)) return ['Invalid user id'];

    return [
      undefined,
      new CreateProductDto(name, description, price, !!available, category, user),
    ];
  }
}
