const Sequelize = require("sequelize");

class Moment extends Sequelize.Model {
  static initiate(sequelize) {
    Moment.init(
      {
        msg: {
          type: Sequelize.TEXT,
        },
        img: {
          type: Sequelize.TEXT,
        },
        time: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Moment",
        tableName: "moments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
}

module.exports = Moment;
