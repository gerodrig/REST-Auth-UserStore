import { CustomError } from '../errors/custom.error';

export class CategoryEntity {

    constructor(
        public id: string,
        public name: string,
        public available: boolean,
    ){}

    static fromObject(object: {[key: string]: any}): CategoryEntity{
        const {id, _id, name, available} = object;

        if(!id && !_id) throw CustomError.badRequest('Category id is required');

        if(!name) throw CustomError.badRequest('Category name is required');

        if(available === undefined) throw CustomError.badRequest('Category available is required');

        return new CategoryEntity(id || _id, name, available);
    }
}