const Asistencia = require('../models/Asistencia');
const Empleado = require('../models/Empleado');

// @desc    Obtener todas las asistencias
// @route   GET /api/asistencias
// @access  Private
exports.getAsistencias = async (req, res) => {
  try {
    let query;
    let filtros = {};
    
    // Si hay un id de empleado en los parámetros, filtrar por empleado
    if (req.params.empleadoId) {
      filtros.empleado = req.params.empleadoId;
    }
    
    // Filtrado por empleado (query param)
    if (req.query.empleado) {
      filtros.empleado = req.query.empleado;
    }
    
    // Filtrado por estado
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    
    // Filtrado por fecha
    if (req.query.fecha) {
      const fecha = new Date(req.query.fecha);
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      
      filtros.fecha = {
        $gte: fechaInicio,
        $lte: fechaFin
      };
    }
    
    query = Asistencia.find(filtros).populate({
      path: 'empleado',
      select: 'nombre apellido ci',
      populate: {
        path: 'agencia',
        select: 'nombre'
      }
    }).populate('registradoPor', 'nombre');
    
    // Ordenar
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-fecha');
    }
    
    // Paginación
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Asistencia.countDocuments(filtros);
    
    query = query.skip(startIndex).limit(limit);
    
    // Ejecutar query
    const asistencias = await query;
    
    // Paginación resultado
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: total,
      pagination,
      data: asistencias
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener una asistencia
// @route   GET /api/asistencias/:id
// @access  Private
exports.getAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findById(req.params.id)
      .populate({
        path: 'empleado',
        select: 'nombre apellido ci',
        populate: {
          path: 'agencia',
          select: 'nombre'
        }
      })
      .populate('registradoPor', 'nombre');
    
    if (!asistencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró asistencia con id ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: asistencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Crear una asistencia
// @route   POST /api/asistencias
// @access  Private
exports.createAsistencia = async (req, res) => {
  try {
    // Agregar usuario que registra la asistencia
    req.body.registradoPor = req.usuario.id;
    
    // Verificar si el empleado existe
    const empleado = await Empleado.findById(req.body.empleado);
    
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: `No se encontró empleado con id ${req.body.empleado}`
      });
    }
    
    const asistencia = await Asistencia.create(req.body);
    
    res.status(201).json({
      success: true,
      data: asistencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar una asistencia
// @route   PUT /api/asistencias/:id
// @access  Private
exports.updateAsistencia = async (req, res) => {
  try {
    let asistencia = await Asistencia.findById(req.params.id);
    
    if (!asistencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró asistencia con id ${req.params.id}`
      });
    }
    
    asistencia = await Asistencia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: asistencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar una asistencia
// @route   DELETE /api/asistencias/:id
// @access  Private
exports.deleteAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findById(req.params.id);
    
    if (!asistencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró asistencia con id ${req.params.id}`
      });
    }
    
    await asistencia.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};