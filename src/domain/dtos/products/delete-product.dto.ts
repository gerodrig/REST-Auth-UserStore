import { Validators } from "../../../config";

export class DeleteProductDto {
  private constructor(
    public readonly id: string,
  ) {}

  static delete(params: { [key: string]: any }): [string?, string?] {
    const { id } = params;
    if(!Validators.isMongoId(id)) return ['Invalid category id'];

    return [
      undefined,
      id,
    ];
  }
}
