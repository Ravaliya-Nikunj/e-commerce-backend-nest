import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoUtil {
  private readonly encryptionKey: string;

  constructor() {
    const encryptionKey = process.env.ENCRYPTION_SECRET_KEY;
    if (!encryptionKey) {
      throw new Error(
        'ENCRYPTION_SECRET_KEY is not defined in environment variables',
      );
    }
    this.encryptionKey = encryptionKey;
  }

  getEncryptionString(plainText: string): string {
    if (!plainText) throw new Error('Plain text cannot be empty');
    try {
      const cipherText = CryptoJS.AES.encrypt(
        plainText,
        this.encryptionKey,
      ).toString();
      if (!cipherText) throw new Error('Encryption failed: Empty result');
      return cipherText;
    } catch (error) {
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  getDecryptionString(cipherText: string): string {
    if (!cipherText) throw new Error('Cipher text cannot be empty');
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.encryptionKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText)
        throw new Error('Decryption failed: Invalid key or corrupted data');
      return originalText;
    } catch (error) {
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : 'Invalid cipher text'}`,
      );
    }
  }
}
