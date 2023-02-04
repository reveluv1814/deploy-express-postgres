const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class CustomerService {
  constructor() {}

  async find() {
    const rta = await models.Customer.findAll({
      //se pone las asociaciones que pusimos en el modelo de customers, en este caso el alias que pusimos en model a la relacion con la tabla Users
      include: ['user'],
    });
    return rta;
  }
  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) throw boom.notFound('customer not found');
    return user;
  }
  async create(data) {
    const newCustomer = await models.Customer.create(data, {
      include: ['user'],
    });//crea el user mediante el modelo y la asociacion que le dimos en el modelo
    return newCustomer;
  }
  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }
  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }
}
module.exports = CustomerService;
