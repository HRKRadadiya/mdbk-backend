'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum', // table name      
      'source_id', {
      type: Sequelize.INTEGER
    },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('forum', 'source_id')
  }
};
