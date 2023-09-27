import { regexs } from '../../../config/';

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static login(object: {
    [key: string]: any;
  }): [string?, LoginUserDto?] {
    const { email, password } = object;

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

    return [undefined, new LoginUserDto(email, password)];
  }
}
