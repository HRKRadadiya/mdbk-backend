'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'member', // table name      
      'client_available_coin', {
      type: Sequelize.DECIMAL,
      defaultValue: 0
    },
    ),

      await queryInterface.addColumn(
        'member', // table name      
        'side_character_available_coin', {
        type: Sequelize.DECIMAL,
        defaultValue: 0
      },
      )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('member', 'side_character_available_coin');
    await queryInterface.removeColumn('member', 'client_available_coin');
  }
};
