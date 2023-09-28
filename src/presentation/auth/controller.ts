import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto, CustomError} from '../../domain/';
import { AuthService } from '../services/auth.service';

export class AuthController {
  //*DI
  constructor(public readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`[ERROR] ${error}`);
    return res.status(500).json({error: 'Internal Server Error'});
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });


  
    this.authService
      .registerUser(registerDto!)
      .then((user) => {
        res.json(user);
      })
      .catch((error) =>  this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);
    if (error) return res.status(400).json({ error });

    this.authService.loginUser(loginUserDto!).then((user) => {
      res.json(user);
    }).catch((error) =>  this.handleError(error, res));

  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;


    this.authService.validateEmail(token).then((user) => {
      console.log('email validated');
      res.json({
        message: 'Email was validated successfully',
      });
    }).catch((error) =>  this.handleError(error, res));
  };
}
