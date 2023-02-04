const { Model, DataTypes, Sequelize } = require('sequelize');

//llamamos a la tabla customer
const { CUSTOMER_TABLE } = require('./customer.model');

//nombre de la tabla
const ORDER_TABLE = 'orders';

//esquema del modelo
const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
  //llave foranea, relacion al customer y es una relacion de uno a muchos
  //ojo
  customerId: {
    field: 'customer_id', //campo
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      //hace refencia a la tabla customer
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL',
  },
  //este atributo saca el total de productos segun su costo, es de tipo virtual por lo que no se guarda en la bd
  //usa get para retornar la funcion o condicion dada
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      //items es el nombre o alias de la asociacion que esta más abajo
      if (this.items.length > 0) {
        //recorrera todos los items y multiplicara la cantidad por el precio
        //reduce pues reduce todo aun valor, que valor? pues el total
        return this.items.reduce((total, item) => {
          return total + item.price * item.OrderProduct.amount;
        }, 0); //inicia en cero
      }
    },
  },
};

//definimos el modelo

class Order extends Model {
  static associate(models) {
    //una orden pertenece a varios clientes
    this.belongsTo(models.Customer, {
      as: 'customer', //alias
      // (ojo)
    });
    //realizamos la asociación: una orden tiene muchos productos
    this.belongsToMany(models.Product, {
      //indicamos la tabla terniaria para crear la relacion muchos a muchos

      //la orden tiene 'items' de compra
      as: 'items', //alias

      //through indica a traves de cual tabla se va a resolver esa relacion
      through: models.OrderProduct,
      foreignKey: 'orderId', //id del modelo en el que estamos
      otherKey: 'productId', //id del otro modelo de la asociacion
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false,
    };
  }
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
