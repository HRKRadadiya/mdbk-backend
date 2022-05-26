'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'member', // table name
				'side_character_profile_progress', // new field name
				{
					type: Sequelize.FLOAT,
					defaultValue: 0
				},
			),
			queryInterface.addColumn(
				'member', // table name
				'client_profile_progress', // new field name
				{
					type: Sequelize.FLOAT,
					defaultValue: 0
				},
			),
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn('member', 'side_character_profile_progress'),
			queryInterface.removeColumn('member', 'client_profile_progress'),
		]);
	}
};
