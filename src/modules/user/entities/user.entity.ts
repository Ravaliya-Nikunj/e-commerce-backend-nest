import {
  Column,
  DataType,
  Model,
  Table,
  BeforeCreate,
  PrimaryKey,
  AllowNull,
  HasOne,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from '../../../helpers/id-generator.util';
import { LoginType } from '../../../common/enums';
import { UserRole } from '../../user-roles/entities/user-role.entity';

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
// NOTE DO NOT use @AllowNull(false) for id field it will not called Hooks.
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    field: 'id',
    type: DataType.STRING(255),
  })
  declare id: string;

  @AllowNull(false)
  @Column({
    field: 'first_name',
    type: DataType.STRING(150),
  })
  declare firstName: string;

  @AllowNull(false)
  @Column({
    field: 'last_name',
    type: DataType.STRING(100),
  })
  declare lastName: string;

  @AllowNull(false)
  @Column({
    field: 'user_name',
    type: DataType.STRING(50),
  })
  declare userName: string;

  @AllowNull(false)
  @Column({
    field: 'email',
    type: DataType.STRING(150),
    unique: true,
  })
  declare email: string;

  @AllowNull(true)
  @Column({
    field: 'phone_code',
    type: DataType.STRING(5),
  })
  declare phoneCode: string;

  @AllowNull(true)
  @Column({
    field: 'phone_number',
    type: DataType.STRING(15),
  })
  declare phoneNumber: string;

  @AllowNull(false)
  @Column({
    field: 'password',
    type: DataType.STRING(255),
  })
  declare password: string;

  @Column({
    field: 'profile_image',
    type: DataType.STRING(255),
    defaultValue: 'default_user.png',
  })
  declare profileImage: string;

  @AllowNull(false)
  @Column({
    field: 'login_type',
    type: DataType.ENUM(...Object.values(LoginType)),
    defaultValue: LoginType.EMAIL,
    comment:
      'type of logins: ("EMAIL", "PHONE", "APPLE", "GOOGLE", "FACEBOOK")',
  })
  declare loginType: LoginType;

  @AllowNull(true)
  @Column({
    field: 'social_id',
    type: DataType.STRING(255),
  })
  declare socialId: string;

  @AllowNull(true)
  @Column({
    field: 'otp',
    type: DataType.STRING(10),
  })
  declare otp: string;

  @Column({
    field: 'is_verified',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isVerified: boolean;

  @AllowNull(true)
  @Column({
    field: 'otp_date',
    type: DataType.DATE,
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

  @AllowNull(true)
  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
  })
  declare deletedAt: Date;

  @HasOne(() => UserRole, {
    foreignKey: 'userId',
    as: 'userRole', // This matches the alias used in the query
  })
  userRole: UserRole;

  @BeforeCreate
  static generateId(instance: User) {
    if (!instance.id) {
      instance.id = IdGeneratorUtil.generateId('USR');
    }
  }
}
