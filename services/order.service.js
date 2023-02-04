const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  //un nuevo servicio para agregar un nuevo item para la tabla order-product
  async addItem(data) {
    const newitem = await models.OrderProduct.create(data);
    return newitem;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      //incluye al customer y de forma anidada podemos traer al usuario y los items order-product
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = OrderService;
