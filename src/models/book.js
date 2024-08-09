const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate() {}
  }

  Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'average_rating',
      },
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
      paranoid: true,
    },
  );

  return Book;
};
