import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserCard } from '../entities/payment-card.entity';
import { CreateCardDto } from '../dtos/create-card.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PaymentCardsRepository {
  constructor(
    @InjectModel(UserCard)
    private readonly cardModel: typeof UserCard,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createCardDto: CreateCardDto,
    userId: string,
    transaction?: Transaction,
  ): Promise<UserCard> {
    // Mask card number before saving (show only last 4 digits)
    const lastFour = createCardDto.cardNumber.slice(-4);
    const maskedCardNumber = `•••• •••• •••• ${lastFour}`;
    const prepareSaveCard: any = {
      ...createCardDto,
      cardNumber: maskedCardNumber,
      userId,
    };
    return this.cardModel.create(prepareSaveCard, { transaction });
  }

  async findAllByUserId(userId: string): Promise<UserCard[]> {
    return this.cardModel.findAll({
      where: { userId },
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: string, userId: string): Promise<UserCard | null> {
    return this.cardModel.findOne({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    updateCardDto: UpdateCardDto,
    userId: string,
    transaction?: Transaction,
  ): Promise<void> {
    // If updating card number, mask it
    if (updateCardDto.cardNumber) {
      const lastFour = updateCardDto.cardNumber.slice(-4);
      updateCardDto.cardNumber = `•••• •••• •••• ${lastFour}`;
    }

    await this.cardModel.update(updateCardDto, {
      where: { id, userId },
      transaction,
    });
  }

  async remove(id: string, userId: string): Promise<number> {
    return this.cardModel.destroy({
      where: { id, userId },
    });
  }

  async setDefaultCard(id: string, userId: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      // Reset all cards to not default
      await this.cardModel.update(
        { isDefault: false },
        {
          where: { userId, isDefault: true },
          transaction,
        },
      );

      // Set the specified card as default
      await this.cardModel.update(
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
