const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
    static initiate(sequelize) {
        Chat.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            msg: {
                type: Sequelize.TEXT,
                allowNull: null
            },
            time: {
                type: Sequelize.STRING(20),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Chat',
            tableName: 'chats',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
};

module.exports = Chat;