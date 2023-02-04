const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class CategoryService {
  constructor() {}
  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    //caso : que me liste todos los productos en esta categoria
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {include: ['products']});
    //incluye el alias del category model 
    //xon esto listara la categoria con los productos que pertenezcan a esta
    return category;
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

module.exports = CategoryService;
