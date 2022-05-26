'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'search_option', // table name
      'registration_type', // new field name
      {
        type: Sequelize.ENUM(['side_character', 'client'])
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('search_option', 'registration_type');
    await queryInterface.sequelize.query('drop type enum_search_option_registration_type;')
  }
};
