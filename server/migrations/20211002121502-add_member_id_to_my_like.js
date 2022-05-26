'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.addColumn(
				'my_like', // table name
				'member_id', // new field name
				{
          type: Sequelize.INTEGER,
          references: { model: 'member', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
				},
			),
		]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.removeColumn('my_like', 'member_id'),
		]);
  }
};
