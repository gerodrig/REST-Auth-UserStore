import { regexs } from '../../../config/';

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) {
      return ['Name is required'];
    }

    if (!email) {
      return ['Email is required'];
    }

    if (!regexs.email.test(email)) {
      return ['Email is invalid'];
    }

    if (!password) {
      return ['Password is required'];
    }
    if(!regexs.password.test(password)){
        return ['Password is invalid'];
    }

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
