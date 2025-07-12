import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptUtil {
  /**
   * The function `bcryptPassword` hashes a given payload using bcrypt with a generated salt.
   * @param payload - String to hash (e.g., password)
   * @returns string - hashed password
   */
  bcryptPassword(payload: string): string {
    return bcrypt.hashSync(payload, bcrypt.genSaltSync(8));
  }

  /**
   * The function `bcryptCompare` compares a new password with an old password using bcrypt.
   * @param newPassword - User input (plain password)
   * @param oldPassword - Hashed password (from DB)
   * @returns boolean - Whether passwords match
   */
  async bcryptCompare(
    newPassword: string,
    oldPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(newPassword, oldPassword);
  }
}
