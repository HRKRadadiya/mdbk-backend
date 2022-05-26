'use strict'
const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'employee_type',
      defaultValue: '',
      newValues: ['full-time', 'part-time', 'freelancer', 'dispatch', 'intern'],
      enumName: 'enum_user_employee_type'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'user',
      columnName: 'employee_type',
      defaultValue: '',
      newValues: ['full-time', 'part-time', 'freelancer', 'dispatch'],
      enumName: 'enum_user_employee_type'
    });
  }
}
