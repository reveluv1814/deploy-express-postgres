const { Model, DataTypes, Sequelize } = require('sequelize');

//nombre de la tabla
const USER_TABLE = 'users';

//esquema define la estructura de la base de datos
const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at', //renombra el nombre
    defaultValue: Sequelize.NOW, //valor por defecto
  },
};

//modelo
class User extends Model {
  static associate(models) {
    this.hasOne(models.Customer, { as: 'customer', foreignKey: 'userId' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
