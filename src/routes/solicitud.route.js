const express = require('express');
const router = express.Router();
const solicitudCtrl = require('../controllers/solicitud.controller');

// POST /api/solicitud -> Registrar una nueva solicitud de viaje
router.post('/', solicitudCtrl.createSolicitud);
router.get('/pendientes', solicitudCtrl.getPendientes);

module.exports = router;