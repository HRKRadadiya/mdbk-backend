'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum', 
      'status',
      {
        type: Sequelize.STRING 
     });
 },

 down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('forum','status')
 }
};
