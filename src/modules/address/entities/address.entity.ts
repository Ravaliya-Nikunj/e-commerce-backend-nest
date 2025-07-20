import {
  Column,
  DataType,
  Model,
  Table,
  BeforeCreate,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from '../../../helpers/id-generator.util';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'user_address',
  timestamps: true,
  underscored: true,
  comment: 'Stores user address information',
})
export class UserAddress extends Model<UserAddress> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(255),
    comment: 'Primary key for the address',
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Reference to the user this address belongs to',
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Name of the address',
  })
  declare name: string;

  @Column({
    field: 'phone_code',
    type: DataType.STRING(5),
    allowNull: false,
    comment: 'Country calling code for the phone number',
  })
  declare phoneCode: string;

  @Column({
    field: 'phone_number',
    type: DataType.STRING(15),
    allowNull: false,
    comment: 'Phone number for the address',
  })
  declare phoneNumber: string;

  @Column({
    field: 'line_1',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'First line of the address',
  })
  declare line1: string;

  @AllowNull
  @Column({
    field: 'line_2',
    type: DataType.STRING(255),
    comment: 'Second line of the address (optional)',
  })
  declare line2: string | null;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    comment: 'City of the address',
  })
  declare city: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    comment: 'State/Province/Region of the address',
  })
  declare state: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    comment: 'Country of the address',
  })
  declare country: string;

  @Column({
    field: 'zip_code',
    type: DataType.STRING(20),
    allowNull: false,
    comment: 'ZIP/Postal code of the address',
  })
  declare zipCode: string;

  @Default(false)
  @Column({
    field: 'is_default',
    type: DataType.BOOLEAN,
    comment: 'Flag to indicate if this is the default address',
  })
  declare isDefault: boolean;

  // Associations
  @BelongsTo(() => User)
  declare user: User;

  @BeforeCreate
  static generateId(instance: UserAddress) {
    if (!instance.id) {
      instance.id = IdGeneratorUtil.generateId('ADDR');
    }
  }
}
