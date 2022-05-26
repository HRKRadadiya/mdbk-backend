'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'member', // table name
        'google_id', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'member', // table name
        'facebook_id', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'member',
        'linkedin_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'member',
        'kakaotalk_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'member',
        'apple_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'member',
        'naver_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('member', 'google_id'),
      queryInterface.removeColumn('member', 'facebook_id'),
      queryInterface.removeColumn('member', 'linkedin_id'),
      queryInterface.removeColumn('member', 'kakaotalk_id'),
      queryInterface.removeColumn('member', 'apple_id'),
      queryInterface.removeColumn('member', 'naver_id')
    ]);
  }
};
