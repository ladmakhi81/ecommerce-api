import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDTO,
  LoginDTO,
  SignupDTO,
  VerifyAccountDTO,
} from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  loginUser(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @Post('/signup')
  signupUser(@Body() dto: SignupDTO) {
    return this.authService.signup(dto);
  }

  @Patch('forget-password')
  forgetPassword(@Body() dto: ForgetPasswordDTO) {
    return this.authService.forgetPassword(dto);
  }

  @Patch('verify-account')
  verifyAccount(@Body() dto: VerifyAccountDTO) {
    return this.authService.verifyAccount(dto);
  }
}
