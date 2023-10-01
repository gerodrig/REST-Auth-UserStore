

export class CreateCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ){}

    static create(object: {[key: string]: any}): [string?, CreateCategoryDto?]{
        const {name, available} = object;
        let availableBool = available;

        if(!name) return ['Name is required', undefined];
        if(typeof available !== 'boolean') {
            availableBool = (available === 'true')
        }

        return [undefined, new CreateCategoryDto(name, availableBool)];
    }
}