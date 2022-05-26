module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('report', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      source_id: {
        type: Sequelize.INTEGER
      },
      report_type: {
        type: Sequelize.ENUM(['request-interview', 'request-contact-information', 'side-character', 'client']),
      },
      member_id: {
        type: Sequelize.INTEGER,
        references: { model: 'member', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('report');
  }
};