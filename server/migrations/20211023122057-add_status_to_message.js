'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'message', // table name      
      'status', {
      type: Sequelize.STRING
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('message', 'status');
  }
};


