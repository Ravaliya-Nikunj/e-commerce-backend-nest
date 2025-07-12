import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  findAll = async (): Promise<User[]> => {
    return this.userRepository.findAll();
  };

  findByEmail = async (email: string): Promise<User | null> => {
    return this.userRepository.findByEmail(email);
  };
}
