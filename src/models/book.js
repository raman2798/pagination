const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate() {}
  }

  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('published');

          return rawValue ? rawValue.toISOString().split('T')[0] : null;
        },
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
