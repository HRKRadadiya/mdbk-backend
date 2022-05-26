'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      profession: {
        type: Sequelize.ENUM(['development', 'design', 'marketing', 'other']),
      },
      field: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_planning_stage: {
        type: Sequelize.ENUM(['idea-ready', 'content-organization-complete', 'detailed-plan-ready', 'other', 'direct']),
      },
      suggested_amount: {
        type: Sequelize.DECIMAL
      },
      is_negotiable: {
        type: Sequelize.ENUM(['yes', 'no']),
        defaultValue: 'no'
      },
      schedule: {
        type: Sequelize.ENUM(['negotiable', 'asap', 'not-hurry', 'direct']),
      },
      schedule_direct_start_date: {
        type: Sequelize.DATEONLY
      },
      schedule_direct_end_date: {
        type: Sequelize.DATEONLY
      },
      city: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      work_related_details: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('project');
  }
};