import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { RegisterUserDto, UserEntity } from '../../domain';
import { CustomError } from '../../domain/errors/custom.error';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      // encrypt password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // JWT to generate token
      const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
      if (!token) throw CustomError.internalServer('Error generating token');

      //TODO: Send email to validate email

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        ...userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: any) {
    //Findone to check if user exists
    const existUser = await UserModel.findOne({ email: loginUserDto.email });
    if (!existUser) throw CustomError.badRequest('Email or password incorrect');

    //Compare password
    const isPasswordCorrect = bcryptAdapter.compare(
      loginUserDto.password,
      existUser.password
    );
    if (!isPasswordCorrect)
      throw CustomError.badRequest('Email or password incorrect');

    // Generate token
    const token = await JwtAdapter.generateToken({ id: existUser.id, email: existUser.email});
    if (!token) throw CustomError.internalServer('Error generating token');

    const { password, ...userEntity } = UserEntity.fromObject(existUser);
    //Return user and token
    return {
      ...userEntity,
      token,
    };
  }
}
