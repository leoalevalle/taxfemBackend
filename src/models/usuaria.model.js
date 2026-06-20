// src/models/usuaria.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Usuaria = sequelize.define('Usuaria', {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    usuario: { type: DataTypes.STRING, allowNull: false, unique: true },
    contraseña: { type: DataTypes.STRING, allowNull: false },
    rol: {
        type: DataTypes.ENUM('pasajera', 'operadora', 'conductora'),
        allowNull: false
    },
    // Atributos específicos de Conductora
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
    matricula: { type: DataTypes.INTEGER, allowNull: true }
}, {
    tableName: 'usuarias',
    timestamps: true
});


module.exports = Usuaria;