const express = require('express');
const {
  getAsistencias,
  getAsistencia,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
} = require('../controllers/asistenciaController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Ruta para obtener asistencias de un empleado específico
router.route('/empleado/:empleadoId').get(protect, getAsistencias);

router.route('/')
  .get(protect, getAsistencias)
  .post(protect, authorize('admin', 'supervisor', 'operador'), createAsistencia);

router.route('/:id')
  .get(protect, getAsistencia)
  .put(protect, authorize('admin', 'supervisor'), updateAsistencia)
  .delete(protect, authorize('admin'), deleteAsistencia);

module.exports = router;