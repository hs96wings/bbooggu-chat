const Sequelize = require("sequelize");

class Black extends Sequelize.Model {
  static initiate(sequelize) {
    Black.init(
      {
        black: {
          type: Sequelize.STRING(20),
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Black",
        tableName: "blacks",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
}

module.exports = Black;
