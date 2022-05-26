'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum_report', // table name      
      'category', {
      type: Sequelize.STRING
    },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('forum_report', 'category')
  }
};