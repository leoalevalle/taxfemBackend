const express = require('express');
const router = express.Router();
const viajeCtrl = require('../controllers/viaje.controller');

// POST /api/viaje/asignar -> Confirmar asignación por parte de la operadora
router.post('/asignar', viajeCtrl.asignarViaje);

module.exports = router;