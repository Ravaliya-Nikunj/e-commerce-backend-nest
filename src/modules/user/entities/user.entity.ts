import {
  Column,
  DataType,
  Model,
  Table,
  BeforeCreate,
} from 'sequelize-typescript';
import { LoginType } from 'src/common/enums';
import { IdGeneratorUtil } from '../../../helpers/id-generator.util';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
  defaultScope: {
    where: {
      is_deleted: false,
    },
  },
})
export class User extends Model<User> {
  @Column({
    field: 'id',
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  declare userId: string;

  @Column({
    field: 'first_name',
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    field: 'last_name',
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    field: 'user_name',
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare userName: string;

  @Column({
    field: 'email',
    type: DataType.STRING(150),
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    field: 'phone_code',
    type: DataType.STRING(5),
    allowNull: true,
  })
  declare phoneCode: string;

  @Column({
    field: 'phone_number',
    type: DataType.STRING(15),
    allowNull: true,
  })
  declare phoneNumber: string;

  @Column({
    field: 'password',
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    field: 'profile_image',
    type: DataType.STRING(255),
    defaultValue: 'default_user.png',
  })
  declare profileImage: string;

  @Column({
    field: 'login_type',
    type: DataType.ENUM(...Object.values(LoginType)),
    allowNull: false,
    defaultValue: LoginType.EMAIL,
    comment:
      'type of logins: ("EMAIL", "PHONE", "APPLE", "GOOGLE", "FACEBOOK")',
  })
  declare loginType: LoginType;

  @Column({
    field: 'social_id',
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare socialId: string;

  @Column({
    field: 'otp',
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare otp: string;

  @Column({
    field: 'is_verified',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @Column({
    field: 'otp_date',
    type: DataType.DATE,
    allowNull: true,
  })
  declare otpDate: Date;

  @Column({
    field: 'is_deleted',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '0. account not deleted / 1. account deleted',
  })
  declare isDeleted: boolean;

  @Column({
    field: 'is_terms_agree',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '0. not agree / 1. agree',
  })
  declare isTermsAgree: boolean;

  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date;

  @BeforeCreate
  static generateId(instance: User) {
    instance.userId = IdGeneratorUtil.generateId('USR');
  }
}
