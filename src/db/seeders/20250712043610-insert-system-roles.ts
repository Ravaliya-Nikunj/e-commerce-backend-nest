import { QueryInterface } from 'sequelize';
import { systemRoles } from '../../common/constants';
import { IdGeneratorUtil } from '../../helpers/id-generator.util';

export default {
  async up(queryInterface: QueryInterface) {
    // Get existing roles
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT name FROM roles WHERE name IN (?)',
      {
        replacements: [systemRoles.map((role) => role.name)],
        type: 'SELECT',
      },
    );

    // Filter out roles that already exist
    const existingRoleNames = existingRoles.map((r: any) => r.name);
    const rolesToInsert = systemRoles
      .filter((role) => !existingRoleNames.includes(role.name))
      .map((role) => ({
        id: IdGeneratorUtil.generateId('RL'),
        name: role.name,
        display_name: role.displayName,
        created_at: new Date(),
        updated_at: new Date(),
      }));

    if (rolesToInsert.length > 0) {
      // Insert only new roles
      await queryInterface.bulkInsert('roles', rolesToInsert, {});
      console.log(`Inserted ${rolesToInsert.length} new system roles`);
    } else {
      console.log('All system roles already exist, skipping insertion');
    }
  },

  async down(queryInterface: QueryInterface) {
    // Remove all roles
    await queryInterface.bulkDelete('roles', {}, {});
    console.log('Removed all system roles');
  },
};
