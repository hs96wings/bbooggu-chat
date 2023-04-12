const Sequelize = require("sequelize");

class Chat extends Sequelize.Model {
  static initiate(sequelize) {
    Chat.init(
      {
        msg: {
          type: Sequelize.TEXT,
        },
        img: {
          type: Sequelize.TEXT,
        },
        ip: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sid: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        time: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Chat",
        tableName: "chats",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
}

module.exports = Chat;
