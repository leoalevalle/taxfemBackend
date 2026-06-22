const express = require('express');
const router = express.Router();
const viajeCtrl = require('../controllers/viaje.controller');

// POST /api/viaje/asignar -> Confirmar asignación por parte de la operadora
router.post('/asignar', viajeCtrl.asignarViaje);
router.put('/aceptar/:idViaje', viajeCtrl.aceptarViaje);
router.put('/rechazar/:idViaje', viajeCtrl.rechazarViaje);
router.get('/', viajeCtrl.getViajesActivos);
router.put('/finalizar/:idViaje', viajeCtrl.finalizarViaje);
router.put('/cancelar/:idViaje', viajeCtrl.cancelarViajeConductora);

module.exports = router;