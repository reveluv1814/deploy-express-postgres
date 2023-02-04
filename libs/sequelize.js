const { Sequelize } = require('sequelize');

//url de conexion
const { config } = require('./../config/config');

//--modelo de sequelize
const setupModels = require('./../db/models');
//--modelo sequelize

/*
------URL DE CONEXION
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
//--------URL de conexion
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;*/

//url de conexion

//hacemos la referencia a sequelize y le pasamos el URL y ademas de la base en la que trabajaremos y el logging en true para ver los resultados en consola

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
};
if (config.isProd) {
  options.dialectOptions = { ssl: { rejectUnauthorized: false } };
}

const sequelize = new Sequelize(config.dbUrl, options);

//envia la conexion a sequelize
setupModels(sequelize);

//sincroniza y luego lee el modelo para crearlo segun el schema
//sequelize.sync();

module.exports = sequelize;
