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
import {
  ForgetPasswordNotification,
  LoginNotification,
  SignupNotification,
} from './notification-decorator';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueKeys } from 'src/queue/queue-keys.constant';
import { Queue } from 'bullmq';
import { VerifyAccountNotification } from './notification-decorator/verify-account-notification.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    @InjectQueue(QueueKeys.LoginEmailQueue)
    public readonly loginEmailQueueService: Queue,
    @InjectQueue(QueueKeys.SignupEmailQueue)
    public readonly signupEmailQueueService: Queue,
    @InjectQueue(QueueKeys.ForgetPasswordEmailQueue)
    public readonly forgetPasswordEmailQueueService: Queue,
    @InjectQueue(QueueKeys.VerifyAccountEmailQueue)
    public readonly verifyAccountEmailQueueService: Queue,
  ) {}

  @SignupNotification()
  async signup(dto: SignupDTO) {
    const user = await this.userService.createUser(dto);
    const accessToken = await this.tokenService.decodeAuthToken({
      userId: user.id,
      isVerifiedAccount: user.isVerifiedAccount,
      role: user.role,
    });
    return { accessToken };
  }

  @LoginNotification()
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
    await this.userService.updateUserById(user.id, {
      lastLoginDate: new Date(),
    });
    return { accessToken };
  }

  @ForgetPasswordNotification()
  async forgetPassword(dto: ForgetPasswordDTO) {
    const user = await this.userService.findUserByEmail(dto.email, true);
    const verifiedToken = this.tokenService.generateVerificationToken();
    await this.userService.updateUserById(user.id, {
      password: dto.newPassword,
    });
    await this.userService.updateVerificationState(
      user.id,
      false,
      verifiedToken,
    );
  }

  @VerifyAccountNotification()
  async verifyAccount(dto: VerifyAccountDTO) {
    const user = await this.userService.findUserByEmail(dto.email, true);
    if (user.verifiedToken !== dto.verificationCode) {
      throw new NotFoundException('Code Not Match With Any User');
    }
    await this.userService.updateVerificationState(user.id, true);
  }
}
