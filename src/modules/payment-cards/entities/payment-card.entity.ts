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
  tableName: 'user_cards',
  timestamps: true,
  underscored: true,
  comment: 'Stores user payment card information',
})
export class UserCard extends Model<UserCard> {
  @PrimaryKey
  @Column({
    type: DataType.STRING(255),
    comment: 'Primary key for the card',
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Reference to the user this card belongs to',
  })
  declare userId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Name on the card',
  })
  declare cardHolderName: string;

  @Column({
    field: 'card_number',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Card number',
  })
  declare cardNumber: string;

  @Column({
    field: 'card_expiry_date',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Card expiry date',
  })
  declare cardExpiryDate: string;

  @Column({
    field: 'card_type',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Card type',
  })
  declare cardType: string;

  @Default(false)
  @Column({
    field: 'is_default',
    type: DataType.BOOLEAN,
    comment: 'Flag to indicate if this is the default card',
  })
  declare isDefault: boolean;

  // Associations
  @BelongsTo(() => User)
  declare user: User;

  @BeforeCreate
  static generateId(instance: UserCard) {
    if (!instance.id) {
      instance.id = IdGeneratorUtil.generateId('CARD');
    }
  }
}
