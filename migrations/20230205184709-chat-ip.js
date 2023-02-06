'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    return [
      queryInterface.addColumn('chats', 'ip', {
        type:sequelize.STRING,
        allowNull: false,
        defaultValue: '127.0.0.1'
      }),
      queryInterface.addColumn('chats', 'agent', {
        type: sequelize.STRING,
        allowNull: false,
        defaultValue: 'Mobile'
      })
    ]
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return [
      queryInterface.removeColumn('chats', 'ip'),
      queryInterface.removeColumn('chats', 'agent')
    ]
  }
};
