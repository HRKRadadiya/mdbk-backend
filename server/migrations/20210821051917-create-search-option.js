'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('search_option', {
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
      search_type: {
        type: Sequelize.ENUM(['client', 'side-character']),
      },
      desired_profession: {
        type: Sequelize.ENUM(['development', 'design', 'marketing', 'other']),
      },
      desired_date: {
        type: Sequelize.ENUM(['weekdays', 'weekend', 'weekdays-weekend']),
      },
      desired_time: {
        type: Sequelize.ENUM(['morning', 'afternoon', 'evening']),
      },
      desired_project_type: {
        type: Sequelize.ENUM(['short-term', 'long-term']),
      },
      insurance_status: {
        type: Sequelize.ENUM(['available', 'unavailable']),
      },
      desired_work_type: {
        type: Sequelize.ENUM(['workfrom-office', 'workfrom-home']),
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
    await queryInterface.dropTable('search_option');
  }
};
