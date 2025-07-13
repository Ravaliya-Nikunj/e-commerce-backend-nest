import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  create = async (user: User, transaction?: any): Promise<User> => {
    return await this.userRepository.create(user, transaction);
  };
  findAll = async (): Promise<UserDto[]> => {
    const users = await this.userRepository.findAll();
    return users.map((user) =>
      plainToClass(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  };

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
