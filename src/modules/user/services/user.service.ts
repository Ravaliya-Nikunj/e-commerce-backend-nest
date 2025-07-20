import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { ContextService } from '../../../shared/services/context.service';
import { UpdateUserDto } from '../../auth/dtos/update-user.dto';
import { CloudinaryUtil } from '../../../shared/utils/cloudinary.utils';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private contextService: ContextService,
    private cloudinaryUtil: CloudinaryUtil,
  ) {}
  create = async (user: User, transaction?: any): Promise<User> => {
    return await this.userRepository.create(user, transaction);
  };

  update = async (
    user: User,
    userId: string,
    transaction?: any,
  ): Promise<User> => {
    return await this.userRepository.update(user, userId, transaction);
  };

  /**
   * Find all users with an option to include admin users
   * @param includeAdmins Whether to include admin users in the result (default: false)
   * @returns Array of UserDto objects
   */
  async findAll(includeAdmins: boolean = false): Promise<UserDto[]> {
    const users = await this.userRepository.findAll(!includeAdmins);
    return users.map((user) =>
      plainToClass(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserDetails(): Promise<UserDto> {
    const email = this.contextService.getEmail();
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`user not found with email :${email}`);
    }
    // Transform to DTO to ensure we only expose the necessary fields
    const userDto = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });

    return userDto;
  }

  async updateProfile(
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<UserDto> {
    const email = this.contextService.getEmail();
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`User not found with email: ${email}`);
    }
    const prepareUpdateUser: any = {
      ...updateUserDto,
    };

    if (file) {
      if (user.profileImage) {
        // unlink cloudinary files
        await this.cloudinaryUtil.unlinkFileFromCloudinary(user.profileImage);
      }

      const { fileName } =
        await this.cloudinaryUtil.uploadSingleFileToCloudinary(
          file,
          'profiles',
        );
      prepareUpdateUser.profileImage = fileName;
    }

    await this.update(prepareUpdateUser, user.id);
    const updatedUser = await this.findByEmail(email);
    return plainToClass(UserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
