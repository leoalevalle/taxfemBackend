const express = require('express');
const router = express.Router();
const conductoraCtrl = require('../controllers/conductora.controller');

// GET /api/conductora/disponibles -> Obtener conductoras listas para viaje
router.get('/disponibles', conductoraCtrl.getDisponibles);
router.get('/:id/viajes', conductoraCtrl.getMisViajes);

module.exports = router;