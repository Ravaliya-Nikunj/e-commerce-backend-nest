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

    await queryInterface.createTable('user_cards', {
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
      card_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'card number',
      },
      card_holder_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'card holder name',
      },
      card_expiry_date: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'card expiry date',
      },
      card_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'card type',
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
    await queryInterface.dropTable('user_cards');
  },
};
