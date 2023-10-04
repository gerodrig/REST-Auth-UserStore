import { Validators } from "../../../config";
export class DeleteCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ){}

    static delete(params: {[key: string]: any}): [string?, string?]{
        const { id } = params;
        if(!Validators.isMongoId(id)) return ['Invalid category id'];
    
        return [
          undefined,
          id,
        ];
    }
}