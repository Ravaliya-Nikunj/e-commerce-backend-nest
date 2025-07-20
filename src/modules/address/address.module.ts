import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAddress } from './entities/address.entity';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { AddressRepository } from './repositories/address.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([UserAddress]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
  exports: [AddressService],
})
export class AddressModule {}