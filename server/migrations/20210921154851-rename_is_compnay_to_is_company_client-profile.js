'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('client_profile', 'is_compnay', 'is_company');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('client_profile', 'is_company', 'is_compnay');
  }
};
