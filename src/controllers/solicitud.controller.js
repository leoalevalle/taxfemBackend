const { Op } = require('sequelize');
const SolicitudViaje = require('../models/solicitudViaje.model');
const Usuaria = require('../models/usuaria.model');
const Viaje = require('../models/viaje.model');

const solicitudCtrl = {};

// + registrarViaje() / crear solicitud
solicitudCtrl.createSolicitud = async (req, res) => {
    try {
        const { pasajeraId, origen, inicio } = req.body;

        // Validar que la usuaria exista y sea una pasajera
        const pasajera = await Usuaria.findByPk(pasajeraId);
        if (!pasajera || pasajera.rol !== 'pasajera') {
            return res.status(404).json({
                status: '0',
                msg: 'La usuaria especificada no existe o no tiene rol de pasajera'
            });
        }

        const nuevaSolicitud = await SolicitudViaje.create({
            pasajeraId,
            origen,
            inicio,
            estado: 'pendiente'
        });

        res.status(201).json({
            status: '1',
            msg: 'Solicitud de viaje registrada con éxito',
            data: nuevaSolicitud
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al registrar la solicitud',
            error: error.message
        });
    }
};

// Obtener solicitudes pendientes (Flujo principal: Paso 1 y 2)
// Obtener solicitudes activas de las pasajeras (Pendientes y Asignadas)
solicitudCtrl.getPendientes = async (req, res) => {
    try {
        const solicitudes = await SolicitudViaje.findAll({
            where: { 
                estado: {
                    [Op.in]: ['pendiente']
                }
            }, 
            include: [
                {
                    model: Usuaria,
                    as: 'pasajera',
                    attributes: ['idUsuario', 'nombre', 'telefono']
                },
                {
                    model: Viaje,
                    // 💡 SI TE SEGUÍA DANDO ERROR POR EL ALIAS:
                    // Cambiá el 'as: 'viaje'' de acá abajo por el alias real de tu relación (ej: 'viajes' o 'datosViaje')
                    // O si hiciste la relación simple sin alias, borrá la línea 'as: ...' por completo.
                    as: 'viaje', 
                    required: false, 
                    include: [{
                        model: Usuaria,
                        as: 'conductora', 
                        attributes: ['nombre', 'matricula']
                    }]
                }
            ]
        });
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al obtener solicitudes', error: error.message });
    }
};

module.exports = solicitudCtrl;