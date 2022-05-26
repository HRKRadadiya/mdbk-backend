'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'side_character_profile_work_experience', // table name      
      'is_employed_currently', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('side_character_profile_work_experience', 'is_employed_currently')
  }
};
