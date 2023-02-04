const Joi = require('joi');

const { createUserSchema, updateUserSchema } = require('./user.schema');

const id = Joi.number().integer();
const customerId = Joi.number().integer();
//para la tabla order-product
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);

const getOrderSchema = Joi.object({
  id: id.required(),
});

const createOrderSchema = Joi.object({
  customerId: customerId.required(),
});

//schema para la tabla order product
const addItemSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
});

module.exports = {
  getOrderSchema,
  createOrderSchema,
  //schema para la tabla oreder-product:
  addItemSchema,
};
