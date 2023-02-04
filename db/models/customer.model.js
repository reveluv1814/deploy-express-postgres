const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const CUSTOMER_TABLE = 'customers';

const CustomerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
    field: 'last_name',
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
  //FK llave foranea
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    //unique significa si el campo es unico, true es si y false no
    unique: true,
    references: {
      //hace refencia a la tabla users al campo id
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL',
  },
};

class Customer extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate(models) {
    //este modelo tiene una relacion de uno a uno (belongsTo) con el modelo User con un alias as:user
    this.belongsTo(models.User, { as: 'user' });

    //otra relacion con orders es bidireccional y un customer puede tener muchos orders
    this.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'customerId', //atributo del modelo order (ojo)
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_TABLE,
      modelName: 'Customer',
      timestamps: false,
    };
  }
}

module.exports = { Customer, CustomerSchema, CUSTOMER_TABLE };
