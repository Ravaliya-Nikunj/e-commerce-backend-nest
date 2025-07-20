'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('user_address', {
      id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        comment: 'id of users table',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'name of the address',
      },
      phone_code: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      line_1: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'line 1 of the address',
      },
      line_2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'line 2 of the address',
      },
      city: {
        type: Sequelize.STRING(150),
        allowNull: false,
        comment: 'city of the address',
      },
      state: {
        type: Sequelize.STRING(150),
        allowNull: false,
        comment: 'state of the address',
      },
      country: {
        type: Sequelize.STRING(150),
        allowNull: false,
        comment: 'country of the address',
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'zip code of the address',
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: '0. not default / 1. default',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_address');
  },
};
