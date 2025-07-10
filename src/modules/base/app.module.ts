import { Module } from '@nestjs/common';
import { LoggingModule } from '../../common/logging/logging.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          dialect: config.get('DB_DIALECT') || 'mysql',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
          autoLoadModels: true,
          synchronize: false,
          logging:
            config.get<string>('NODE_ENV') === 'development'
              ? console.log
              : false,
        };
      },
    }),
    LoggingModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
