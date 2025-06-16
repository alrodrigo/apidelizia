const Desempeno = require('../models/Desempeno');
const Empleado = require('../models/Empleado');

// Obtener todos los registros de desempeño
exports.getDesempenos = async (req, res) => {
  try {
    const { empleadoId, desde, hasta, page = 1, limit = 10 } = req.query;
    const queryObj = {};
    
    // Filtrar por empleado si se proporciona un ID
    if (empleadoId) {
      queryObj.empleado = empleadoId;
    }
    
    // Filtrar por rango de fechas si se proporcionan
    if (desde || hasta) {
      queryObj.fecha = {};
      if (desde) queryObj.fecha.$gte = new Date(desde);
      if (hasta) queryObj.fecha.$lte = new Date(hasta);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const desempenos = await Desempeno.find(queryObj)
      .populate('empleado', 'nombre apellido ci')
      .populate('evaluador', 'nombre apellido rol')
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Desempeno.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: desempenos.length,
      total,
      data: desempenos,
      items: desempenos, // Para compatibilidad con el frontend
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de desempeño',
      error: err.message
    });
  }
};

// Obtener un registro de desempeño por ID
exports.getDesempenoById = async (req, res) => {
  try {
    const desempeno = await Desempeno.findById(req.params.id)
      .populate('empleado', 'nombre apellido ci cargo')
      .populate('evaluador', 'nombre apellido rol');
    
    if (!desempeno) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el registro de desempeño'
      });
    }
    
    res.status(200).json({
      success: true,
      data: desempeno
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de desempeño',
      error: err.message
    });
  }
};

// Crear un nuevo registro de desempeño
exports.createDesempeno = async (req, res) => {
  try {
    // Verificar que el empleado existe
    const empleado = await Empleado.findById(req.body.empleado);
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: 'El empleado no existe'
      });
    }
    
    // Asignar el usuario actual como evaluador
    req.body.evaluador = req.usuario.id;
    
    const desempeno = await Desempeno.create(req.body);
    
    res.status(201).json({
      success: true,
      data: desempeno
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al crear el registro de desempeño',
      error: err.message
    });
  }
};

// Actualizar un registro de desempeño
exports.updateDesempeno = async (req, res) => {
  try {
    const desempeno = await Desempeno.findById(req.params.id);
    
    if (!desempeno) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el registro de desempeño'
      });
    }
    
    // Solo permitir que el evaluador original o un admin realice la actualización
    if (desempeno.evaluador.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este registro'
      });
    }
    
    const desempenoActualizado = await Desempeno.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: desempenoActualizado
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de desempeño',
      error: err.message
    });
  }
};

// Eliminar un registro de desempeño
exports.deleteDesempeno = async (req, res) => {
  try {
    const desempeno = await Desempeno.findById(req.params.id);
    
    if (!desempeno) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el registro de desempeño'
      });
    }
    
    // Solo permitir que el evaluador original o un admin realice la eliminación
    if (desempeno.evaluador.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este registro'
      });
    }
    
    await desempeno.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Registro de desempeño eliminado correctamente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de desempeño',
      error: err.message
    });
  }
};
