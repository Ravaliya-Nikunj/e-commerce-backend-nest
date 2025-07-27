import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentCardsController } from './controllers/payment-cards.controller';
import { PaymentCardsService } from './services/payment-cards.service';
import { PaymentCardsRepository } from './repositories/payment-cards.repository';
import { UserCard } from './entities/payment-card.entity';
import { User } from '../user/entities/user.entity';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserCard, User]),
    SharedModule,
  ],
  controllers: [PaymentCardsController],
  providers: [
    PaymentCardsService, 
    PaymentCardsRepository,
    {
      provide: 'UserCardRepository',
      useValue: UserCard,
    },
  ],
  exports: [PaymentCardsService],
})
export class PaymentCardsModule {}
