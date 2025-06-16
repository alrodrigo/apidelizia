const Agencia = require('../models/Agencia');

// @desc    Obtener todas las agencias
// @route   GET /api/agencias
// @access  Private
exports.getAgencias = async (req, res) => {
  try {
    const agencias = await Agencia.find().populate('encargado', 'nombre email');
    
    res.status(200).json({
      success: true,
      count: agencias.length,
      data: agencias
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener una agencia
// @route   GET /api/agencias/:id
// @access  Private
exports.getAgencia = async (req, res) => {
  try {
    const agencia = await Agencia.findById(req.params.id).populate('encargado', 'nombre email');
    
    if (!agencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró agencia con id ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: agencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Crear una agencia
// @route   POST /api/agencias
// @access  Private/Admin
exports.createAgencia = async (req, res) => {
  try {
    const agencia = await Agencia.create(req.body);
    
    res.status(201).json({
      success: true,
      data: agencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar una agencia
// @route   PUT /api/agencias/:id
// @access  Private/Admin
exports.updateAgencia = async (req, res) => {
  try {
    let agencia = await Agencia.findById(req.params.id);
    
    if (!agencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró agencia con id ${req.params.id}`
      });
    }
    
    agencia = await Agencia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: agencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar una agencia
// @route   DELETE /api/agencias/:id
// @access  Private/Admin
exports.deleteAgencia = async (req, res) => {
  try {
    const agencia = await Agencia.findById(req.params.id);
    
    if (!agencia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró agencia con id ${req.params.id}`
      });
    }
    
    await agencia.deleteOne();
    
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