'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('client_profile_company', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_profile_id: {
        type: Sequelize.INTEGER,
        references: { model: 'client_profile', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      introduction: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      contact_information: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profession: {
        type: Sequelize.TEXT('medium')
      },
      registation_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      foundation_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      representative_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total_employees: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('client_profile_company');
  }
};