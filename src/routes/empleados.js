const express = require('express')
const {
    getEmpleados,
    getEmpleado,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
}= require('../controllers/empleadoController')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

// Rutas protegidas para empleados
router.route('/')
    .get(protect, getEmpleados)
    .post(protect, createEmpleado)
    
// Ruta de prueba con autenticación básica
router.get('/test', protect, async (req, res) => {
  try {
    const Empleado = require('../models/Empleado');
    const empleados = await Empleado.find().populate('agencia').limit(5);
    res.json({ success: true, count: empleados.length, data: empleados });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.route('/:id')
    .get(protect, getEmpleado)
    .put(protect, updateEmpleado)
    .delete(protect, deleteEmpleado)
module.exports = router
