import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { RegisterUserDto, UserEntity } from '../../domain';
import { CustomError } from '../../domain/errors/custom.error';
import { EmailService } from './email.service';

export class AuthService {
  constructor(
    //DI email service
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      // encrypt password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // JWT to generate token
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer('Error generating token');

      //? Send email to validate email
      await this.sendEmailValidation(user.email);


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

  private sendEmailValidation = async (email: string): Promise<boolean> => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const htmlBody = `<h1>Validate your email</h1>
    <p>Click on the following link to validate your email</p>
    <a href="${link}">Validate email: ${email}</a>`;

    const isSent = await this.emailService.sendEmail({
      to: email,
      subject: 'Validate your email',
      htmlBody,
    });

    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  }

  public validateEmail = async (token: string): Promise<boolean> => {

    const payload = await JwtAdapter.validateToken(token);
    if(!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as {email: string};
    if(!email) throw CustomError.internalServer('Error validating email');

    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.internalServer('Error validating email');
    
    if(user.isEmailVerified) {
      throw CustomError.badRequest('Email already validated');
    }


    user.isEmailVerified = true;

    await user.save();

    return true;
  }
}
