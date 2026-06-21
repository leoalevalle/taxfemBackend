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
            estadoDeViaje: 'pendiente'
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

viajeCtrl.aceptarViaje = async (req, res) => {
    try {
        const { idViaje } = req.params; // Pasamos el ID por la URL de la ruta

        // Buscar el viaje junto con la información de la pasajera
        const viaje = await Viaje.findByPk(idViaje, {
            include: [{ model: SolicitudViaje, as: 'solicitud', include: [{ model: Usuaria, as: 'pasajera' }] }]
        });

        if (!viaje || viaje.estadoDeViaje !== 'pendiente') {
            return res.status(400).json({ status: '0', msg: 'El viaje no existe o ya fue respondido.' });
        }

        // Cambiamos el estado a 'encurso' (O el que uses en tu UML)
        await viaje.update({ estadoDeViaje: 'encurso' });

        console.log(`[NOTIFICACIÓN] ¡Viaje #${viaje.idViaje} ACEPTADO! Notificando a Pasajera: su taxi va en camino.`);

        res.status(200).json({
            status: '1',
            msg: 'Viaje aceptado con éxito. ¡Buen viaje, conductora!',
            data: viaje
        });

    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al aceptar el viaje.', error: error.message });
    }
};

viajeCtrl.rechazarViaje = async (req, res) => {
    try {
        const { idViaje } = req.params;

        const viaje = await Viaje.findByPk(idViaje);
        if (!viaje || viaje.estadoDeViaje !== 'pendiente') {
            return res.status(400).json({ status: '0', msg: 'El viaje no existe o ya fue respondido.' });
        }

        // Obtener la conductora y la solicitud vinculadas
        const conductora = await Usuaria.findByPk(viaje.conductoraId);
        const solicitud = await SolicitudViaje.findByPk(viaje.solicitudId);

        // 🔄 LOGICA DE LIBERACIÓN:
        // El viaje se marca como 'finalizado/cancelado'
        await viaje.update({ estadoDeViaje: 'finalizado' }); 
        
        // La conductora vuelve a estar LIBRE para recibir otros viajes
        if (conductora) await conductora.update({ disponible: true });
        
        // ⚠️ La solicitud VUELVE a estar 'pendiente' para que la operadora la asigne a otra conductora
        if (solicitud) await solicitud.update({ estado: 'pendiente' });

        console.log(`[NOTIFICACIÓN] Viaje #${idViaje} RECHAZADO por la conductora. Solicitud devuelta a la mesa de control.`);

        res.status(200).json({
            status: '1',
            msg: 'Viaje rechazado. La solicitud vuelve a estar disponible para asignación.'
        });

    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al rechazar el viaje.', error: error.message });
    }
};

module.exports = viajeCtrl;