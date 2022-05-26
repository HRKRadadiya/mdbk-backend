'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'project', 
      'direct_input',
      {
        type: Sequelize.STRING 
     });
 },

 down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('project','direct_input')
 }
};
