const { Sequelize } = require('sequelize');

require('dotenv').config();

let sequelize;

// Si existe la variable en Render, se conecta mediante la URL completa
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Evita llenar la consola de Render con logs SQL
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Requerido obligatoriamente por Render para conexiones seguras
      }
    }
  });
} else {
  // Configuración local que ya tenías para tu computadora
  sequelize = new Sequelize(
    process.env.DB_NAME,     // Toma el valor del .env local
    process.env.DB_USER,     // Toma el valor del .env local
    process.env.DB_PASSWORD, // Toma el valor del .env local 
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      logging: console.log
    }
  );
}

module.exports = sequelize;