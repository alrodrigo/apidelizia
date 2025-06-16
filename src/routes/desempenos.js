const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDesempenos,
  getDesempenoById,
  createDesempeno,
  updateDesempeno,
  deleteDesempeno
} = require('../controllers/desempenoController');

// Rutas protegidas - requieren autenticación
router.use(protect);

// Rutas para todos los usuarios autenticados
router.get('/', getDesempenos);
router.get('/:id', getDesempenoById);
router.post('/', createDesempeno);

// Rutas solo para admin y supervisor
router.put('/:id', updateDesempeno);
router.delete('/:id', deleteDesempeno);

module.exports = router;
