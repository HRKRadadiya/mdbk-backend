'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_application', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: { model: 'project', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      applicant_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      wage_type: {
        type: Sequelize.ENUM(['hourly', 'daily', 'monthly']),
      },
      suggested_amount: {
        type: Sequelize.INTEGER
      },
      is_negotiable: {
        type: Sequelize.ENUM(['yes', 'no']),
        defaultValue: 'no'
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: { model: 'message', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: Sequelize.ENUM(['accepted', 'rejected', 'waiting']),
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
    await queryInterface.dropTable('project_application');
  }
};
