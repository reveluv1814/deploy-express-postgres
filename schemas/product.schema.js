const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer().min(10);
const description = Joi.string().min(10);
const image = Joi.string().uri();
const categoryId = Joi.number().integer();

//limit y offset ---ver el readme
const limit = Joi.number().integer();
const offset = Joi.number().integer();
//para el filtrado
const price_min = Joi.number().integer().min(10);
const price_max = Joi.number().integer().min(10);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  image: image.required(),
  categoryId: categoryId.required(),
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  description,
  categoryId,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

//creamos esquema para los query limit y offset
const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  price_min, //hacemos una validacion para el max para que se envien ambos min y max
  price_max: price_max.when('price_min', {
    //si existe un min que sea numero entonces será requerido el max
    is: Joi.exist(),
    then: Joi.required(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  queryProductSchema,
};
