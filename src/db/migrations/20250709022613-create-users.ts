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
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      first_name: { type: Sequelize.STRING(150), allowNull: false },
      last_name: { type: Sequelize.STRING(100), allowNull: false },
      user_name: { type: Sequelize.STRING(50), allowNull: false },
      email: {
        type: Sequelize.STRING(150),
        unique: true,
      },
      phone_code: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING(255),
        defaultValue: 'default_user.png',
      },
      login_type: {
        type: Sequelize.ENUM('EMAIL', 'PHONE', 'APPLE', 'GOOGLE', 'FACEBOOK'),
        allowNull: false,
        defaultValue: 'EMAIL',
        comment:
          'type of logins : ("EMAIL", "PHONE", "APPLE", "GOOGLE", "FACEBOOK")',
      },
      social_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      otp: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      otp_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: '0. account not deleted / 1. account deleted',
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('users');
  },
};
