const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getObservaciones,
  getObservacionById,
  createObservacion,
  updateObservacion,
  deleteObservacion
} = require('../controllers/observacionController');

// Rutas protegidas - requieren autenticación
router.use(protect);

// Rutas para todos los usuarios autenticados
router.get('/', getObservaciones);
router.get('/:id', getObservacionById);
router.post('/', createObservacion);

// Rutas para el creador de la observación o admin
router.put('/:id', updateObservacion);
router.delete('/:id', deleteObservacion);

module.exports = router;
