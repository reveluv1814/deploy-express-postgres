# POSTGRES + NODE

+ Primero instalamos y configuramos un contenedor en Docker
+ Hacemos la integración de Docker+Node: `npm install pg`
+ Y en la carpeta libs en el archivo *postgres.js* hacemos la configuración y la conexión de la bd
+ Pool (Pooling) nos ayuda a crear una conexion una vez y usar esa en las demas dependencias.
+ ## Variables de entorno: 
	* En la carpeta config en el archivo config.js este tiene variables de entorno que exportamos y en el archivo postgres.pool en libs, hacemos la configuaracion de la conexion, protegiendo el password y user de la bd y ademas usando un URL de conexion.
	* Despues creamos a+un archivo *.env* y ponemos los datos necesarios de las variables de entorno
	* Para que el archivo *config* lea el *.env* instalamos un modulo: `npm i dotenv` y en el archivo *config lo importamos* :`require('dotenv').config();` y listo este obtendrá los datos del archivo *.env*
+ ## ORM (Object Relational Model):
	* Un ORM es un modelo de programación que permite mapear las estructuras de una base de datos relacionales.
+ ## SEQUELIZE
	* ORM para javascript, comando de instalacion: `npm install --save sequelize` y para el driver de Postgres: `npm install --save pg-hstore`
	* Creamos el archivo de sequelize en libs. Luego se crea el modelo, en `db/models` ahí se crea el modelo para las tablas (esquemas y la estructura) y el index que inicializa cada modelo.
	* Para usarlos, en cada servicio en la carpeta *services* importamos el archivo *sequelize*: `const {models}= require('./../libs/sequelize')` en models se guarda por defecto todos los modelos. Y para usarlo debemos poner el nombre que pusimos en el modelo (archivo dentro de la carpeta models. ej de User : `modelName: 'User',`) así : `const rta = await models.User.findAll()` y así se hace la consulta.
+ ## MIGRACIONES:
	* Sistema de control de cambios de la base de datos, ayuda a el control de sincroniazción de la bd.
	* **Es como un sistema de control de versiones para manejar los cambios desde el código y trackear los cambios en la base de datos.** - *Sequelize.*
	* ***Las migraciones son como un git para bases de datos relacionales, para no tener que reemplazar toda la base de datos sino solo agregar los cambios correspondientes.***
	* *Básicamente, las migraciones mantienen el historial del esquema que se lleva en la base de datos. Es un sistema muy usado en ambientes de producción para trackear los cambios sin tener que replicar todo nuevamente (creación de tablas, llaves foráneas, etc). Es decir, permite saber en qué punto estaba para saber qué es lo que se tiene que modificar.*
	* `sequelize.sync()` empieza a leer los modelos, crea tablas y hace relist (se sobrescribe información), no se aconseja que se corra en producción. Es mejor sincronizar con un sistema de migraciones.
	* Para correr migraciones se utiliza la librería `sequelize-cli` y se instala como dependencia de desarrollo con el comando `npm i sequelize-cli -D`.
	* `npm i sequelize-cli --save-dev` (save dev es una dependencia de desarrollo) [Documentación](https://sequelize.org/docs/v6/other-topics/migrations/)
	* Posteriormente, se crea un archivo de configuración **`.sequelizerc`** en la carpeta principal.
	``` javascript
	module.exports = {
  'config': './db/config.js',
  'models-paths: './db/models',
  'migrations-paths: './db/migrations',
  'seeders-path': './db/seeders',} 
  ```

	* **config →** Dónde se encuentra la configuración, esta configuración se encuentra la conexión hacia la BD. El cli tiene su propia conexión, independientemente de la conexión de la aplicación porque esas conexiones corren a nivel de terminal.
	* **models-paths →** Dónde se encuentran los modelos.
	* **migrations-paths →** Dónde se encuentran las migraciones.
	* **seeders-path →** Dónde se encuentran las semillas de información, sirve mucho para pruebas unitarias, end to end, donde se necesitan semillas de información que es como cargar varios datos de información a la BD.
	* **NOTA:** Se crean las carpetas ***migrations, models, seeders*** y el archivo ***config.js*** dentro de la carpeta **db**.
+ ## USANDO MIGRACIONES
	* Sequelize no crea las migraciones de forma automática como otros ORM en base a los cambios que se tengan en el modelo. Tenemos el motor para hacer migraciones y nosotros decimos el cómo debemos hacer las migraciones.
El script `"migrations:generate": "sequelize-cli migration:generate --name"` va a generar el boilerplate de una migración.
Por ejemplo, en la terminal se ejecuta **`npm run migrations:generate create-user`** para crear una migración para los usuarios.
Esto va a crear un archivo (boilerplate) que es una pieza de código lista para empezar a correr migraciones, pero manualmente se debe poner cómo hacer y qué correr.
Ejemplo del boilerplate para migrar usuario ***20220109030523-create-user.j***
	* Se requiere el esquema y el nombre de la tabla. Para revertir cambios se escribe código en ***down***. Es decir, se revierte lo que se puso en ***up***.
En caso de que se tengan varios modelos, se pueden integrar en el mismo archivo.

	```javascript
		'use strict';

	const { UserSchema, USER_TABLE } = require('../models/user.model');

	module.exports = {
	  up: async (queryInterface) => {
		await queryInterface.createTable(USER_TABLE, UserSchema);
	  },

	  down: async (queryInterface) => {
		await queryInterface.drop(USER_TABLE);
	  },
	};
	```
	* Para correr las migraciones se añade un script con el comando **`"migrations:run": "sequelize-cli db:migrate"`**. De esa manera detecta todas las migraciones de la carpeta migrations y las empieza a correr.
	* También, se puede hacer un rollback añadiendo el script **`"migrations:revert":"sequelize-cli db:migrate:undo"`**, y de esa manera revertimos a la última migración.
	* Otro script (peligroso) que se puede añadir es **`"migrations:delete": "sequelize-cli db:migrate:undo:all"`**, esto va a vaciar todas las migraciones, es decir, va a revertir todas las migraciones que se hayan corrido como para empezar de cero. ***Hay que tener cuidado en producción ya que ese comando borraría todo, incluyendo la información.***
	* Al ejecutar **`"npm run migrations:run"`** se crean las tablas del modelo y además la tabla SequelizeMeta que guarda el histórico de las migraciones que se han ejecutado.
* ## MODIFICANDO UNA TABLA CON SEQUELIZE
	* Con **`sequelize.sync()`** no se puede alterar una tabla que ya está creada ya que únicamente lee el modelo, y en caso de hacer alguna modificación, se queda con la primera versión (no se puede agregar un atributo más). Con las migraciones es más flexible ya que sí se pueden hacer modificaciones y tener todo de una forma organizada.
	* Creamos una migracion para añadir un campo *add role* usando el comando: **`npm run migrations:generate add-role` **
	* Para agregar una columna se hace con el método addColumn, se define el nombre de la tabla, seguido del nombre de la columna, finalmente el esquema (nulo, string, etc), en ese caso se define el esquema del campo en específico.
	```
	await queryInterface.addColumn(USER_TABLE, 'role', UserSchema.
	```
	* Para quitar la columna se usa el método ***removeColumn*** definiendo el nombre de la tabla y de la columna.
	```
	await queryInterface.removeColumn(USER_TABLE, 'role');
	```

* ## Proceso de crear archivos
	* primero el esquema
	* segundo las rutas
	* tercero el modelo
	* cuarto el servicio
	* quinto la migracion

* ## Relación MUCHOS A MUCHOS
	* Se crea una tabla ternaria

* ## PAGINACIÓN
	* ### LIMIT & OFSET
	* - El **limit** es el número de elemto que quiero que me traigan.
	* - El **offset** es un apuntador como un indice en un array 
	* **Limit** → Número de elementos que deseo traer. Límite de elementos que deseo traer en cada página.
	* **Offset** → Apuntador, es decir, cuántos elementos quiero escapar.
	* Ejemplo: Si en una página tengo una lista de elementos [1, 2, 4, 5, 6]. Si limit = 2 y offset = 0, el resultado será [1, 2]. 
	Si deseo que en la siguiente página siga trayendo 2 elementos, entonces limit = 2 y offset = 2, solo cambia el apuntador. El resultado será [3, 4].
	Si deseo que en la siguiente página siga trayendo 2 elementos, entonces limit = 2 y offset = 4. El resultado será [5, 6].

* ## APUNTES: [AQUÍ](https://principled-leek-8ec.notion.site/Curso-de-Backend-con-Node-js-Base-de-Datos-con-PostgreSQL-a98cff016323473aaa261daf2b8d3e2b)
