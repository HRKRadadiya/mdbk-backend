'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum', 
      'source_type',
      {
        type: Sequelize.STRING 
     });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('forum','source_type')
  }
};
