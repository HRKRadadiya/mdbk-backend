"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("notifications", "source_type");
    await queryInterface.sequelize.query(
      "drop type enum_notifications_source_type;"
    );
    await queryInterface.removeColumn("notifications", "source_id");

    await queryInterface.addColumn("notifications", "from_member_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("notifications", "to_member_id", {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("notifications", "source_type", {
      type: Sequelize.ENUM(["side-character", "client"]),
    });
    await queryInterface.addColumn("notifications", "source_id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn("notifications", "to_member_id");
    await queryInterface.removeColumn("notifications", "from_member_id");
  },
};
