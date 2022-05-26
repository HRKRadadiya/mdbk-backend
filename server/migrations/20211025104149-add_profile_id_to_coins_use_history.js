'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'coins_use_history', // table name      
      'profile_id', {
        type: Sequelize.INTEGER
      },
    ),

    await queryInterface.addColumn(
      'coins_use_history', // table name      
      'profile_type', {
        type: Sequelize.STRING
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('coins_use_history', 'profile_id');
    await queryInterface.removeColumn('coins_use_history', 'profile_type');
  }
};
