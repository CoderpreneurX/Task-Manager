"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "full_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "full_name");
    await queryInterface.removeColumn("Users", "role");
  },
};
