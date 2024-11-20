import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async encode(text: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(text, salt);
  }

  async compare(plainText: string, hashedText: string) {
    return bcrypt.compare(plainText, hashedText);
  }
}
