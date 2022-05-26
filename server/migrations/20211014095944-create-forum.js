'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forum', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      member_id: {
        type: Sequelize.INTEGER
      },
      link: {
        allowNull: true,
        type: Sequelize.STRING
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      category: {
        allowNull: true,
        type: Sequelize.ENUM(['development', 'design', 'marketing', 'other']),
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('forum');
  }
};