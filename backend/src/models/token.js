const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Token extends Model {
    static associate(models) {
      // Define associations here, if necessary
    }

    // Method to check if the token has expired
    static isExpired(token) {
      const expirationTime = new Date(token.createdAt);
      expirationTime.setHours(expirationTime.getHours() + 24); // Add 24 hours to createdAt
      return new Date() > expirationTime;
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      code: DataTypes.STRING,
      purpose: DataTypes.ENUM("email_verification", "password_reset"),
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Token",
      timestamps: false, // Disable automatic createdAt/updatedAt handling
    }
  );

  return Token;
};
