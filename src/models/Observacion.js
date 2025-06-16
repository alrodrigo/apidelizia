const mongoose = require('mongoose');

const ObservacionSchema = new mongoose.Schema({
  empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['positiva', 'negativa', 'neutral'],
    default: 'neutral'
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  desarrollo: {
    type: String,
    trim: true
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Observacion', ObservacionSchema);
