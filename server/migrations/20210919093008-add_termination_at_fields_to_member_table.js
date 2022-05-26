'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
				'member', // table name
				'termination_at', // new field name
				{
					type: Sequelize.DATE,
					allowNull: true
				},
			)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('member', 'termination_at')
  }
};
