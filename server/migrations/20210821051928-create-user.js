'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      user_name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      employee_type: {
        type: Sequelize.ENUM(['full-time', 'part-time', 'freelancer', 'dispatch']),
      },
      login_type: {
        type: Sequelize.ENUM(['google', 'facebook', 'naver', 'kakaotalk', 'apple', 'website']),
      },
      role: {
        type: Sequelize.ENUM(['supar-admin', 'admin']),
      },
      status: {
        type: Sequelize.ENUM(['enable', 'disable', 'deleted']),
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  }
};