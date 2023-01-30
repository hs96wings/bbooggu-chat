const path = require('path')
const Chat = require('./chat');
const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
    {
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

db.Chat = Chat;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

Chat.initiate(sequelize);

module.exports = db;