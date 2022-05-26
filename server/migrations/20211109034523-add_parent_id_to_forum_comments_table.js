'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'forum_comments', // table name      
      'parent_id', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('forum_comments', 'parent_id')
  }
};
