import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentCardsRepository } from '../repositories/payment-cards.repository';
import { CreateCardDto } from '../dtos/create-card.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import {
  PaymentCardDto,
  PaymentCardWithUserDto,
} from '../dtos/payment-card.dto';
import { plainToClass } from 'class-transformer';
import { ContextService } from '../../../shared/services/context.service';

@Injectable()
export class PaymentCardsService {
  constructor(
    private readonly paymentCardsRepository: PaymentCardsRepository,
    private readonly contextService: ContextService,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<PaymentCardDto> {
    const userId = this.contextService.getUserId();
    const card = await this.paymentCardsRepository.create(
      createCardDto,
      userId,
    );

    // If this is set as default, update other cards
    if (createCardDto.isDefault) {
      await this.paymentCardsRepository.setDefaultCard(card.id, userId);
    }

    return plainToClass(PaymentCardDto, card, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByUserId(): Promise<PaymentCardDto[]> {
    const userId = this.contextService.getUserId();
    const cards = await this.paymentCardsRepository.findAllByUserId(userId);

    return cards.map((card) =>
      plainToClass(PaymentCardDto, card, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<PaymentCardWithUserDto> {
    const userId = this.contextService.getUserId();
    const card = await this.paymentCardsRepository.findOne(id, userId);

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return plainToClass(PaymentCardWithUserDto, card, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateCardDto: UpdateCardDto,
  ): Promise<PaymentCardDto> {
    const userId = this.contextService.getUserId();

    // Check if card exists
    const existingCard = await this.paymentCardsRepository.findOne(id, userId);
    if (!existingCard) {
      throw new NotFoundException('Card not found');
    }

    await this.paymentCardsRepository.update(id, updateCardDto, userId);

    // If this is set as default, update other cards
    if (updateCardDto.isDefault) {
      await this.paymentCardsRepository.setDefaultCard(id, userId);
    }
    const updatedCard = await this.paymentCardsRepository.findOne(id, userId);

    return plainToClass(PaymentCardDto, updatedCard, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const userId = this.contextService.getUserId();
    const card = await this.paymentCardsRepository.findOne(id, userId);

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.isDefault) {
      throw new BadRequestException(
        'Cannot delete default card. Set another card as default first.',
      );
    }

    const deletedCount = await this.paymentCardsRepository.remove(id, userId);
    if (deletedCount === 0) {
      throw new NotFoundException('Failed to delete card');
    }
  }

  async setDefaultCard(id: string): Promise<PaymentCardDto> {
    const userId = this.contextService.getUserId();
    const card = await this.paymentCardsRepository.findOne(id, userId);

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.isDefault) {
      return plainToClass(PaymentCardDto, card, {
        excludeExtraneousValues: true,
      });
    }

    await this.paymentCardsRepository.setDefaultCard(id, userId);

    // Fetch the updated card
    const updatedCard = await this.paymentCardsRepository.findOne(id, userId);
    return plainToClass(PaymentCardDto, updatedCard, {
      excludeExtraneousValues: true,
    });
  }
}
