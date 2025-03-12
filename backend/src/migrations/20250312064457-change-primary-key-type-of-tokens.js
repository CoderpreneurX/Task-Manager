module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tokens', 'id');  // Remove the old UUID primary key

    await queryInterface.addColumn('Tokens', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Make the column auto-incrementing
    });

    // Optionally, if you want to change other fields (like ensuring the table still has the correct fields):
    await queryInterface.changeColumn('Tokens', 'userId', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface) => {
    // Revert back to UUID (if necessary)
    await queryInterface.removeColumn('Tokens', 'id');

    await queryInterface.addColumn('Tokens', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    });
  },
};
