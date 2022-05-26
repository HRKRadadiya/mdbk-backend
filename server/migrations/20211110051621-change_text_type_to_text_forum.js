'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Promise.all([
            queryInterface.changeColumn('forum', 'text', {
                type: Sequelize.TEXT,
            }),

            queryInterface.changeColumn('forum_comments', 'text', {
                type: Sequelize.TEXT,
            })
        ])
  },

  down: async (queryInterface, Sequelize) => {
    return await Promise.all([
            queryInterface.changeColumn('forum', 'text', {
                type: Sequelize.STRING,
            }),

            queryInterface.changeColumn('forum_comments', 'text', {
                type: Sequelize.STRING,
            })
        ])
  }
};
