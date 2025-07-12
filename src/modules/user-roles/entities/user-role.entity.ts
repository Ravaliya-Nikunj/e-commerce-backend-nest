import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BeforeCreate,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from '../../../helpers/id-generator.util';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Table({
  tableName: 'user_roles',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'role_id'],
    },
  ],
})
export class UserRole extends Model<UserRole> {
  @Column({
    field: 'id',
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
    unique: true,
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
