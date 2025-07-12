import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  create = async (user: User, transaction?: any): Promise<User> => {
    return await this.userRepository.create(user, transaction);
  };
  findAll = async (): Promise<User[]> => {
    return await this.userRepository.findAll();
  };

  findByEmail = async (email: string): Promise<User | null> => {
    return await this.userRepository.findByEmail(email);
  };
}
