import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAddress } from '../entities/address.entity';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectModel(UserAddress)
    private readonly addressModel: typeof UserAddress,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: string,
    transaction?: Transaction,
  ): Promise<UserAddress> {
    const prepareCreateUserAddress: any = {
      ...createAddressDto,
      userId,
    };
    return await this.addressModel.create(prepareCreateUserAddress, {
      transaction,
    });
  }

  async findAll(userId: string): Promise<UserAddress[]> {
    return await this.addressModel.findAll({
      where: { userId },
      include: [{ model: User }],
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: string, userId: string): Promise<UserAddress | null> {
    return await this.addressModel.findOne({
      where: { id, userId },
      include: [{ model: User }],
    });
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
    userId: string,
    transaction?: Transaction,
  ): Promise<void> {
    await this.addressModel.update(updateAddressDto, {
      where: { id, userId },
      returning: true,
      transaction,
    });
  }

  async remove(id: string, userId: string): Promise<number> {
    return await this.addressModel.destroy({
      where: { id, userId },
    });
  }

  async setDefaultAddress(id: string, userId: string): Promise<void> {
    // const transaction = await this.addressModel.sequelize.transaction();
    const transaction = await this.sequelize.transaction();
    try {
      // Reset all addresses to not default
      await this.addressModel.update(
        { isDefault: false },
        {
          where: { userId, isDefault: true },
          transaction,
        },
      );

      // Set the specified address as default
      await this.addressModel.update(
        { isDefault: true },
        {
          where: { id, userId },
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
