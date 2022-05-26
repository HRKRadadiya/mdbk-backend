'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'member', // table name
      'email_verified', // new field name
      {
        type: Sequelize.ENUM(['yes', 'no']),
        defaultValue: 'no',
        allowNull: true
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('member', 'email_verified');
    await queryInterface.sequelize.query('drop type enum_member_email_verified;')
  }
};
