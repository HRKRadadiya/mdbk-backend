'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'member', // table name
      'is_notification', // new field name
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('member', 'is_notification')
  }
};
