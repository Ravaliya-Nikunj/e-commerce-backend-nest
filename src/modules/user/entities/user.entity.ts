import {
  Column,
  DataType,
  Model,
  Table,
  BeforeCreate,
} from 'sequelize-typescript';
import { IdGeneratorUtil } from 'src/utils/id-generator.util';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @BeforeCreate
  static generateId(instance: User) {
    instance.id = IdGeneratorUtil.generateId('USR');
  }
}
