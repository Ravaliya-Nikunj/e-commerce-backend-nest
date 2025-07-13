import { BcryptUtil } from '../../shared/utils/bcrypt.util';
import { RoleType } from '../../common/enums';
import { IdGeneratorUtil } from '../../helpers/id-generator.util';

const bcryptUtil = new BcryptUtil();

const adminEmail = 'admin@ecommerce.com';
const adminPassword = 'ecommerce@123';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check if admin already exists
      const existingAdmin = await queryInterface.select(null, 'users', {
        where: { email: adminEmail },
        transaction,
        limit: 1,
      });

      if (existingAdmin && existingAdmin.length > 0) {
        console.log('Admin user already exists, skipping...');
        await transaction.rollback();
        return;
      }

      // Get ADMIN role
      const adminRole = await queryInterface.select(null, 'roles', {
        where: { name: RoleType.ADMIN },
        transaction,
        limit: 1,
      });

      if (!adminRole || adminRole.length === 0) {
        throw new Error(
          'ADMIN role not found. Please run the role seeder first.',
        );
      }

      // Create admin user
      const userId = IdGeneratorUtil.generateId('USR');
      await queryInterface.bulkInsert(
        'users',
        [
          {
            id: userId,
            first_name: 'Admin',
            last_name: 'User',
            user_name: 'admin',
            email: adminEmail,
            password: bcryptUtil.bcryptPassword(adminPassword),
            is_terms_agree: true,
          },
        ],
        { transaction },
      );

      // Assign ADMIN role
      await queryInterface.bulkInsert(
        'user_roles',
        [
          {
            id: IdGeneratorUtil.generateId('UR'),
            user_id: userId,
            role_id: adminRole[0].id,
          },
        ],
        { transaction },
      );

      await transaction.commit();
      console.log('Admin user created successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating admin user:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: adminEmail,
    });
  },
};
