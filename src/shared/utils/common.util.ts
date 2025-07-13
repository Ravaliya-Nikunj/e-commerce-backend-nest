import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtil {
  /**
   * Generate a unique-style username using name and email
   * @param firstname User's first name
   * @param lastname User's last name
   * @param email User's email
   * @returns A suggested unique username (e.g., johndoe928 or jdoe92)
   */
  generateUsername = (
    firstname: string,
    lastname: string,
    email: string,
  ): string => {
    const clean = (str: string) =>
      str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

    const first = clean(firstname);
    const last = clean(lastname);
    const emailPrefix = clean(email.split('@')[0]);

    // Combine name parts with fallback to email prefix
    let base = first && last ? `${first}${last}` : emailPrefix;

    // Add random digits for uniqueness
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit number

    return `${base}${randomSuffix}`;
  };
}
