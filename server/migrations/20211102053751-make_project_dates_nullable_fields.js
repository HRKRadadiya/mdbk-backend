"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn("project", "schedule_direct_start_date", {
				type: Sequelize.DATEONLY,
				allowNull: true,
			}),
			queryInterface.changeColumn("project", "schedule_direct_end_date", {
				type: Sequelize.DATEONLY,
				allowNull: true,
			}),
			queryInterface.changeColumn("project", "direct_input", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn("project", "direct_input", {
				type: Sequelize.STRING,
			}),
			queryInterface.changeColumn("project", "schedule_direct_end_date", {
				type: Sequelize.DATEONLY,
			}),
			queryInterface.changeColumn("project", "schedule_direct_start_date", {
				type: Sequelize.DATEONLY,
			}),
		]);
	},
};
