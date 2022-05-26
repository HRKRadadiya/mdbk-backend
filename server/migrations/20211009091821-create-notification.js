"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("notifications", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			source_id: {
				type: Sequelize.INTEGER,
			},
			source_type: {
				allowNull: false,
				type: Sequelize.ENUM(["side-character", "client"]),
			},
			notification_type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			is_read: {
				type: Sequelize.ENUM(["yes", "no"]),
				defaultValue: "no",
			},
			meta: {
				type: Sequelize.TEXT('medium'),
				allowNull: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("notifications");
	},
};
