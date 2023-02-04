const { Model, DataTypes, Sequelize } = require('sequelize');

//nombre de la tabla
const CATEGORY_TABLE = 'categories';

//esquema del modelo
const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

//definimos el modelo

class Category extends Model {
  static associate(models) {
    //una categoria puede tener muchos Productos
    this.hasMany(models.Product, {
      as: 'products', //alias
      foreignKey: 'categoryId', //atributo del modelo product (ojo)
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Category',
      timestamps: false,
    };
  }
}

module.exports = { Category, CategorySchema, CATEGORY_TABLE };
