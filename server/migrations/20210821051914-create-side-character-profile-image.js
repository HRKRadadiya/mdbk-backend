'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('side_character_profile_image', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            side_character_profile_id: {
                type: Sequelize.INTEGER,
                references: { model: 'side_character_profile', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            file_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            original_file_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('side_character_profile_image');
    }
};