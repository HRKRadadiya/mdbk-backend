'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'payment_history', // table name
      'payment_type', // new field name
      {
        type: Sequelize.ENUM(['purchase', 'bonus']),
        defaultValue: 'purchase'
      },
    )
    await queryInterface.addColumn(
      'payment_history', // table name
      'updated_at', // new field name
      {
        type: Sequelize.DATE,
        allowNull: true
      },
    )
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('payment_history', 'payment_type');
    await queryInterface.sequelize.query('drop type enum_payment_history_payment_type;')

  }

};
