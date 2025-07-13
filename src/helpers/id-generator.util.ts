import { v4 as uuidv4 } from 'uuid';

export class IdGeneratorUtil {
  static generateId(prefix: string): string {
    return `${prefix}_${uuidv4().split('-')[0].toUpperCase()}`;
  }
}
