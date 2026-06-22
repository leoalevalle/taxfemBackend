const Usuaria = require('../models/usuaria.model');
const Viaje = require('../models/viaje.model');
const SolicitudViaje = require('../models/solicitudViaje.model');

const conductoraCtrl = {};

conductoraCtrl.getDisponibles = async (req, res) => {
    try {
        const conductoras = await Usuaria.findAll({
            where: { rol: 'conductora', disponible: true },
            attributes: ['idUsuario', 'nombre', 'telefono', 'matricula']
        });

        // Flujo Alternativo (4): No hay conductoras disponibles
        if (conductoras.length === 0) {
            return res.status(200).json({
                status: '1',
                msg: 'No se encontraron conductoras disponibles en este momento',
                data: []
            });
        }

        res.status(200).json({
            status: '1',
            msg: 'Conductoras disponibles encontradas',
            data: conductoras
        });
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al consultar disponibilidad', error: error.message });
    }
};

// Obtener los viajes asignados a una conductora específica
conductoraCtrl.getMisViajes = async (req, res) => {
    try {
        const { id } = req.params;
        const viajes = await Viaje.findAll({
            where: { conductoraId: id, estadoDeViaje: ['pendiente', 'asignado', 'encurso'] },
            include: [{
                model: SolicitudViaje,
                as: 'solicitud',
                include: [{ model: Usuaria, as: 'pasajera', attributes: ['nombre', 'telefono'] }]
            }]
        });
        res.status(200).json(viajes);
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al obtener viajes', error: error.message });
    }
};

module.exports = conductoraCtrl;