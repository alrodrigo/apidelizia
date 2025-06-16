const express = require('express');
const {
  getAgencias,
  getAgencia,
  createAgencia,
  updateAgencia,
  deleteAgencia
} = require('../controllers/agenciaController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getAgencias)
  .post(protect, authorize('admin'), createAgencia);

router.route('/:id')
  .get(protect, getAgencia)
  .put(protect, authorize('admin'), updateAgencia)
  .delete(protect, authorize('admin'), deleteAgencia);

module.exports = router;