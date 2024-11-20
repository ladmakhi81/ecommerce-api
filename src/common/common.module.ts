import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HashModule } from './hash/hash.module';
import { TokenModule } from './token/token.module';

@Global()
@Module({ imports: [PrismaModule, HashModule, TokenModule] })
export class CommonModule {}
