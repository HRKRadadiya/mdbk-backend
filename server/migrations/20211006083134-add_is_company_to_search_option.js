'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'search_option', // table name
      'is_company', // new field name
      {
        type: Sequelize.ENUM(['yes', 'no']),
        defaultValue: null,
        allowNull: true
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('search_option', 'is_company');
    await queryInterface.sequelize.query('drop type enum_search_option_is_company;')
  }
};
