module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER, // 🔥 Change UUID to INTEGER
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed"),
        defaultValue: "pending",
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { timestamps: true, paranoid: true, deletedAt: "deleted_at" }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
  };

  return Task;
};
