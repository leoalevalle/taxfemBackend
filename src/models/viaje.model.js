// src/models/viaje.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Viaje = sequelize.define('Viaje', {
    idViaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    horaInicio: { type: DataTypes.DATE, allowNull: false },
    horaFin: { type: DataTypes.DATE, allowNull: true },
    estadoDeViaje: {
        type: DataTypes.ENUM('pendiente', 'asignado', 'encurso', 'finalizado'),
        defaultValue: 'pendiente',
        allowNull: false
    }
}, {
    tableName: 'viajes',
    timestamps: true
});

module.exports = Viaje;