//envia la conexion a los modelos

const { User, UserSchema } = require('./user.model');
const { Customer, CustomerSchema } = require('./customer.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderProduct, OrderProductSchema } = require('./order-product');

//configuracion de los modelos
function setupModels(sequelize) {
  //inicia modelos
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));

  //crea la asociacion de customers y users
  //----uno a uno
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);

  //----uno a muchos
  Category.associate(sequelize.models);
  Product.associate(sequelize.models); /* uno a uno ya que un producto tiene 
  una categoria y una categoria tiene muchos productos */

  Order.associate(sequelize.models);

  
}

module.exports = setupModels;
