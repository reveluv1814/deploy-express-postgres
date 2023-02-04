const { Model, DataTypes, Sequelize } = require('sequelize');

//importamos la tabla de asociacion
const { CATEGORY_TABLE } = require('./category.model');

//nombre de la tabla
const PRODUCT_TABLE = 'products';

//esquema del modelo
const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
    //unique: true, no existe el unique por que queremos muchos
  },
  //generamos la asociación de uno a muchos
  //FK llave foranea
  //ojo
  categoryId: {
    field: 'category_id', //campo
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      //hace refencia a la tabla categories
      model: CATEGORY_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL',
  },
};

//definimos el modelo

class Product extends Model {
  static associate(models) {
    //un producto tiene un categoria
    this.belongsTo(models.Category, { as: 'category' }); //alias
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false,
    };
  }
}

module.exports = { Product, ProductSchema, PRODUCT_TABLE };
