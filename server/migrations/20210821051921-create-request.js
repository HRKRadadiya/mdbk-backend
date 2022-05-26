'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('request', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from_member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      to_member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      request_type: {
        type: Sequelize.ENUM(['contact-information', 'interview']),
      },
      wage_type: {
        type: Sequelize.ENUM(['hourly', 'daily', 'monthly']),
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      is_negotiable: {
        type: Sequelize.ENUM(['yes', 'no']),
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: { model: 'message', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: Sequelize.ENUM(['accepted', 'rejected', 'waiting', 'accept']),
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
    await queryInterface.dropTable('request');
  }
};