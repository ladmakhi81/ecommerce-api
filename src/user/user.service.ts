import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserByIdDTO } from './dtos';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HashService } from 'src/common/hash/hash.service';
import { TokenService } from 'src/common/token/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const duplicatedEmailAddress = await this.findUserByEmail(dto.email);
    if (duplicatedEmailAddress) {
      throw new ConflictException('User Duplicated Email Address');
    }
    const passwordHashed = await this.hashService.encode(dto.password);
    const verificationCode = this.tokenService.generateVerificationToken();
    return this.prismaService.user.create({
      data: {
        email: dto.email,
        password: passwordHashed,
        fullName: dto.fullName,
        role: dto.role,
        verifiedToken: verificationCode,
      },
    });
  }

  async updateVerificationState(
    id: number,
    isVerify: boolean,
    verifiedToken?: string,
  ) {
    let data: Record<string, any> = {};
    if (isVerify) {
      data = {
        isVerifiedAccount: true,
        verifiedDate: new Date(),
        verifiedToken: null,
      };
    } else {
      data = {
        isVerifiedAccount: false,
        verifiedDate: null,
        verifiedToken,
      };
    }
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async updateUserById(id: number, dto: UpdateUserByIdDTO) {
    if (dto.password) {
      dto.password = await this.hashService.encode(dto.password);
    }

    return this.prismaService.user.update({ where: { id }, data: dto });
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    const user = await this.findUserByEmail(email, true);
    const isPasswordMatching = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new NotFoundException(
        'User Is Not Found With This Email Address And Password',
      );
    }
    return user;
  }

  async findUserByEmail(email: string, throwError: boolean = false) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user && throwError) {
      throw new NotFoundException('User Not Found With This Email Address');
    }
    return user;
  }

  async findUserById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User Not Found With This Id');
    }
    return user;
  }
}
