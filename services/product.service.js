const faker = require('faker');
const boom = require('@hapi/boom');

//importamos los operadores de sequelize para el filtrado
const { Op } = require('sequelize');

//Uasamos pool para usar una sola conexion
//const pool = require('../libs/postgres.pool');

//Usamos sequelize ya que es un orm y ademas tiene un pool interno
const { models } = require('../libs/sequelize');

class ProductsService {
  constructor() {
    this.products = [];
    this.generate();

    /* usando POOl
    this.pool = pool;
    this.pool.on('error', (e) => console.log(e)); */
  }

  generate() {
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
        isBlock: faker.datatype.boolean(),
      });
    }
  }

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  /*async find({ ...rest }) {
    const options = { include: ['category'], rest };
    const res = await models.Product.findAll(options);
    return res;
  }*/

  async find({ limit, offset, price, price_min, price_max }) {
    const options = {
      include: ['category'],
      limit,
      offset,
      //where sirve para filtrar
      where: {},
    };
    /*
    // extraemos lo que vino en query:limit y offset
    const { limit, offset } = query;
    //si vienen los dos agregamos a options el limit y offset y lo enviamos al findAll
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    } 
    
    pero una forma directa es poniendo a { limit, offset } como parametro 
    y en include poner   limit, offset
    así evitamos el if
    */

    //where par hacer el filtrado ver el product schema
    if (price) options.where.price = price;
    if (price_min && price_max)
      options.where.price = {
        //gte es mayor igual y lte es menor igual
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };

    /*const query = 'SELECT * FROM tasks';
     usando pool
    const rta = await this.pool.query(query) */
    //usando sequelize:

    //---incluimos la asociacion
    const products = await models.Product.findAll(options);
    //include: ['category'] alias del modelo Product
    //listara el producto incluido su categoria
    return products;
  }

  async findOne(id) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('product is block');
    }
    return product;
  }

  async update(id, changes) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes,
    };
    return this.products[index];
  }

  async delete(id) {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    this.products.splice(index, 1);
    return { id };
  }
}

module.exports = ProductsService;
