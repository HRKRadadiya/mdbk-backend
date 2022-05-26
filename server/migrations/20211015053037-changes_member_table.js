"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "member", // table name
      "step_completion", // new field name
      {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        defaultValue: JSON.stringify({
          side_character: [],
          client: []
        })
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("member", "step_completion");
  },
};
