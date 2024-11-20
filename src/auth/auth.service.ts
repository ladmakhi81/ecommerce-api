import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ForgetPasswordDTO,
  LoginDTO,
  SignupDTO,
  VerifyAccountDTO,
} from './dtos';
import { TokenService } from 'src/common/token/token.service';
import { UserService } from 'src/user/user.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async signup(dto: SignupDTO) {
    const user = await this.userService.createUser(dto);
    const accessToken = await this.tokenService.decodeAuthToken({
      userId: user.id,
      isVerifiedAccount: user.isVerifiedAccount,
      role: user.role,
    });
    return { accessToken };
  }

  async login(dto: LoginDTO) {
    const user = await this.userService.findUserByEmailAndPassword(
      dto.email,
      dto.password,
    );
    if (!user.isVerifiedAccount) {
      throw new BadRequestException(
        'First Verify Your Account By Email Address',
      );
    }
    const accessToken = await this.tokenService.decodeAuthToken({
      isVerifiedAccount: user.isVerifiedAccount,
      role: user.role,
      userId: user.id,
    });
    return { accessToken };
  }

  async forgetPassword(dto: ForgetPasswordDTO) {
    const user = await this.userService.findUserByEmail(dto.email, true);
    const verifiedToken = this._generateVerificationToken();
    await this.userService.updateUserById(user.id, {
      password: dto.newPassword,
    });
    await this.userService.updateVerificationState(
      user.id,
      false,
      verifiedToken,
    );
    // !TODO: send verification token to specific email address
  }

  async verifyAccount(dto: VerifyAccountDTO) {
    const user = await this.userService.findUserByEmail(dto.email, true);
    if (user.verifiedToken !== dto.verificationCode) {
      throw new NotFoundException('Code Not Match With Any User');
    }
    await this.userService.updateVerificationState(user.id, true);
    // !TODO: notify user by email address that your account verified successfully
  }

  private _generateVerificationToken() {
    return randomBytes(10).toString('hex');
  }
}
