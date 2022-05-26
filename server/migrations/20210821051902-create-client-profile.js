'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('client_profile', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nick_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      introduction: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING
      },
      phone_verification_code: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      profession: {
        type: Sequelize.TEXT('medium')
      },
      homepage_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebook_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      instagram_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      other_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_compnay: {
        type: Sequelize.ENUM(['yes', 'no']),
        defaultValue: 'no'
      },
      desired_date: {
        type: Sequelize.ENUM(['weekdays', 'weekend', 'weekdays-weekend'])
      },
      desired_time: {
        type: Sequelize.ENUM(['morning', 'afternoon', 'evening'])
      },
      desired_project_type: {
        type: Sequelize.ENUM(['short-term', 'long-term'])
      },
      insurance_status: {
        type: Sequelize.ENUM(['available', 'unavailable'])
      },
      desired_work_type: {
        type: Sequelize.ENUM(['workfrom-office', 'workfrom-home'])
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
    await queryInterface.dropTable('client_profile');
  }
};