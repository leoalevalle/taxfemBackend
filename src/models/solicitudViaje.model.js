// src/models/solicitudViaje.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SolicitudViaje = sequelize.define('SolicitudViaje', {
    idS: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fechaHora: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    origen: { type: DataTypes.STRING, allowNull: false },
    inicio: { type: DataTypes.STRING, allowNull: false }, // Destino o inicio de ruta según el diagrama
    estado: { type: DataTypes.ENUM('pendiente', 'asignado'), defaultValue: 'pendiente' }
}, {
    tableName: 'solicitudes_viaje',
    timestamps: true
});

module.exports = SolicitudViaje;