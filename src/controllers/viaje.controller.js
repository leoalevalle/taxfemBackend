const Viaje = require('../models/viaje.model');
const SolicitudViaje = require('../models/solicitudViaje.model');
const Usuaria = require('../models/usuaria.model');

const viajeCtrl = {};

viajeCtrl.asignarViaje = async (req, res) => {
    try {
        const { solicitudId, operadoraId, conductoraId, fecha, horaInicio } = req.body;

        // 1. Selecciona la solicitud de viaje pendiente.
        const solicitud = await SolicitudViaje.findByPk(solicitudId, {
            include: [{ model: Usuaria, as: 'pasajera' }]
        });
        
        if (!solicitud || solicitud.estado !== 'pendiente') {
            return res.status(400).json({ 
                status: '0', 
                msg: 'La solicitud no existe o ya no se encuentra pendiente.' 
            });
        }

        // 2. Busca y valida la conductora seleccionada a asignar.
        const conductora = await Usuaria.findOne({ where: { idUsuario: conductoraId, rol: 'conductora' } });
        if (!conductora || !conductora.disponible) {
            return res.status(400).json({ 
                status: '0', 
                msg: 'La conductora seleccionada no está disponible o no existe.' 
            });
        }

        // 9. Registra la asignación del viaje.
        const nuevoViaje = await Viaje.create({
            solicitudId,
            operadoraId,
            conductoraId,
            fecha,
            horaInicio,
            estadoDeViaje: 'asignado'
        });

        // 10. Actualiza estado de solicitud a “Asignado” y ocupa a la conductora.
        await solicitud.update({ estado: 'asignado' });
        await conductora.update({ disponible: false });

        // 12 y 13. Simulación de Notificaciones de Datos de Viaje a Conductora y Pasajera
        console.log(`[NOTIFICACIÓN] Enviando datos a Conductora ${conductora.nombre}: Viaje ID ${nuevoViaje.idViaje}`);
        console.log(`[NOTIFICACIÓN] Enviando datos a Pasajera ${solicitud.pasajera.nombre}: Su conductora asignada es ${conductora.nombre}`);

        // 11. Muestra el mensaje de asignación exitosa.
        res.status(201).json({
            status: '1',
            msg: 'Asignación del viaje realizada con éxito.',
            data: {
                viaje: nuevoViaje,
                notificaciones: {
                    conductoraNotificada: true,
                    pasajeraNotificada: true
                }
            }
        });

    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error crítico al procesar la asignación del viaje',
            error: error.message
        });
    }
};

module.exports = viajeCtrl;