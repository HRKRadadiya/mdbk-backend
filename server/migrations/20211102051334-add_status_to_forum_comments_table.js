'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum_comments', 
      'status',
      {
        type: Sequelize.STRING 
     });
 },

 down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('forum_comments','status')
 }
};
