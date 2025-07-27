import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';
import { UserAddress } from '../entities/address.entity';
import { ContextService } from '../../../shared/services/context.service';
import { AddressDto, AddressWithUserDto } from '../dtos/address.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private contextService: ContextService,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<AddressDto> {
    const userId = this.contextService.getUserId();
    const address = await this.addressRepository.create(
      createAddressDto,
      userId,
    );
    return plainToClass(AddressDto, address, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<AddressWithUserDto[]> {
    const userId = this.contextService.getUserId();
    const rows = await this.addressRepository.findAll(userId);
    const addresses = rows.map((row) => {
      return plainToClass(AddressWithUserDto, row, {
        excludeExtraneousValues: true,
      });
    });
    return addresses;
  }

  async findOne(id: string): Promise<AddressDto> {
    const userId = this.contextService.getUserId();
    const address = await this.addressRepository.findOne(id, userId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return plainToClass(AddressDto, address, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDto> {
    const userId = this.contextService.getUserId();
    await this.addressRepository.update(id, updateAddressDto, userId);
    // If this is set as default, update other addresses
    if (updateAddressDto.isDefault) {
      await this.addressRepository.setDefaultAddress(id, userId);
    }
    const updatedAddress = await this.addressRepository.findOne(id, userId);
    return plainToClass(AddressDto, updatedAddress, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const userId = this.contextService.getUserId();
    const address = await this.addressRepository.findOne(id, userId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.isDefault) {
      throw new BadRequestException(
        'Cannot delete default address. Set another address as default first.',
      );
    }

    const deletedCount = await this.addressRepository.remove(id, userId);
    if (deletedCount === 0) {
      throw new NotFoundException('Address not found');
    }
  }

  async setDefaultAddress(id: string): Promise<AddressDto> {
    const userId = this.contextService.getUserId();
    const address = await this.addressRepository.findOne(id, userId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.isDefault) {
      return plainToClass(AddressDto, address, {
        excludeExtraneousValues: true,
      }); // Already default
    }

    await this.addressRepository.setDefaultAddress(id, userId);
    return plainToClass(
      AddressDto,
      this.addressRepository.findOne(id, userId),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
