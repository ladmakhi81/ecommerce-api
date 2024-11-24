import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service';
import { AuthRequest } from 'src/common/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as AuthRequest;
    const headerToken = request.header('Authorization');
    if (!headerToken) {
      throw new UnauthorizedException();
    }
    const [bearer, token] = headerToken.split(' ');
    if (!bearer || bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException();
    }
    const verifiedToken = this.tokenService.verifyToken(token);
    if (!verifiedToken) {
      throw new UnauthorizedException();
    }
    const loggedInUser = await this.userService.findUserById(
      verifiedToken.userId,
    );
    if (!loggedInUser.isVerifiedAccount) {
      throw new UnauthorizedException('You Need To Verify Your Account');
    }
    request.user = loggedInUser;
    return true;
  }
}
