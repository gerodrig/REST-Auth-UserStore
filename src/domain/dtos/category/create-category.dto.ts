import mongoose from "mongoose";


export class CreateCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ){}

    static create(object: {[key: string]: any}): [string?, CreateCategoryDto?]{
        const {name, available, id } = object;
        let availableBool = available;

        if(!name) return ['Name is required', undefined];
        if(typeof available !== 'boolean') {
            availableBool = (available === 'true')
        }
        if(id && !mongoose.isValidObjectId(id)) return ['Invalid ID', undefined];

        return [undefined, new CreateCategoryDto(name, availableBool)];
    }
}