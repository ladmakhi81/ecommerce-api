import { Global, Module } from '@nestjs/common';
import { HashService } from './hash.service';

@Module({ providers: [HashService], exports: [HashService] })
@Global()
export class HashModule {}
