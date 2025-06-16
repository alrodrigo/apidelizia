const Observacion = require('../models/Observacion');
const Empleado = require('../models/Empleado');

// Obtener todas las observaciones
exports.getObservaciones = async (req, res) => {
  try {
    const { empleadoId, tipo, desde, hasta, page = 1, limit = 10 } = req.query;
    const queryObj = {};
    
    // Filtrar por empleado si se proporciona un ID
    if (empleadoId) {
      queryObj.empleado = empleadoId;
    }
    
    // Filtrar por tipo de observación si se proporciona
    if (tipo) {
      queryObj.tipo = tipo;
    }
    
    // Filtrar por rango de fechas si se proporcionan
    if (desde || hasta) {
      queryObj.fecha = {};
      if (desde) queryObj.fecha.$gte = new Date(desde);
      if (hasta) queryObj.fecha.$lte = new Date(hasta);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const observaciones = await Observacion.find(queryObj)
      .populate('empleado', 'nombre apellido ci')
      .populate('registradoPor', 'nombre apellido rol')
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Observacion.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: observaciones.length,
      total,
      data: observaciones,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las observaciones',
      error: err.message
    });
  }
};

// Obtener una observación por ID
exports.getObservacionById = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id)
      .populate('empleado', 'nombre apellido ci cargo')
      .populate('registradoPor', 'nombre apellido rol');
    
    if (!observacion) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la observación'
      });
    }
    
    res.status(200).json({
      success: true,
      data: observacion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la observación',
      error: err.message
    });
  }
};

// Crear una nueva observación
exports.createObservacion = async (req, res) => {
  try {
    // Verificar que el empleado existe
    const empleado = await Empleado.findById(req.body.empleado);
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: 'El empleado no existe'
      });
    }
    
    // Asignar el usuario actual como registrador
    req.body.registradoPor = req.usuario.id;
    
    const observacion = await Observacion.create(req.body);
    
    res.status(201).json({
      success: true,
      data: observacion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al crear la observación',
      error: err.message
    });
  }
};

// Actualizar una observación
exports.updateObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    
    if (!observacion) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la observación'
      });
    }
    
    // Solo permitir que el registrador original o un admin realice la actualización
    if (observacion.registradoPor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta observación'
      });
    }
    
    // Actualizar la fecha de modificación
    req.body.updatedAt = Date.now();
    
    const observacionActualizada = await Observacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: observacionActualizada
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la observación',
      error: err.message
    });
  }
};

// Eliminar una observación
exports.deleteObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    
    if (!observacion) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la observación'
      });
    }
    
    // Solo permitir que el registrador original o un admin realice la eliminación
    if (observacion.registradoPor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta observación'
      });
    }
    
    await observacion.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Observación eliminada correctamente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la observación',
      error: err.message
    });
  }
};
