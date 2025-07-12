import {
  Column,
  DataType,
  Model,
  Table,
  BeforeCreate,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from 'src/utils/id-generator.util';

@Table({
  tableName: 'roles',
  timestamps: true,
  underscored: true,
})
export class Role extends Model<Role> {
  @Column({
    field: 'id',
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  declare id: string;

  @Column({
    field: 'name',
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 150],
    },
  })
  declare name: string;

  @Column({
    field: 'display_name',
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 150],
    },
  })
  declare displayName: string;

  @BeforeCreate
  static generateId(instance: Role) {
    instance.id = IdGeneratorUtil.generateId('RL');
  }
}
