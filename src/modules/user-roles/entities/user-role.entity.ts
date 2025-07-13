import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BeforeCreate,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from '../../../helpers/id-generator.util';
import { User } from '../../../modules/user/entities/user.entity';
import { Role } from '../../../modules/role/entities/role.entity';

@Table({
  tableName: 'user_roles',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'role_id'],
    },
  ],
})
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @Column({
    field: 'id',
    type: DataType.STRING(255),
  })
  declare id: string;

  @ForeignKey(() => Role)
  @Column({
    field: 'role_id',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'id of roles table',
  })
  declare roleId: string;

  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'id of users table',
  })
  declare userId: string;

  @BeforeCreate
  static generateId(instance: UserRole) {
    instance.id = IdGeneratorUtil.generateId('UR');
  }
}
