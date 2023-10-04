import { CustomError } from '../errors/custom.error';

export class ProductEntity {

    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public available: boolean,
        public category: string,
    ){}

    static fromObject(object: {[key: string]: any}): ProductEntity{
        const {id, _id, name, description, price, available, category} = object;

        if(!id && !_id) throw CustomError.badRequest('Product id is required');

        if(!name) throw CustomError.badRequest('Product name is required');

        if(!description) throw CustomError.badRequest('Product description is required');

        if(price === undefined) throw CustomError.badRequest('Product price is required');

        if(available === undefined) throw CustomError.badRequest('Product available is required');

        if(!category) throw CustomError.badRequest('Product category is required');

        return new ProductEntity(id || _id, name, description, price, available, category);

    }
}