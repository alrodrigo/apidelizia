const mongoose = require('mongoose');

const DesempenoSchema = new mongoose.Schema({
  empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  puntualidad: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  proactividad: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  calidadServicio: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  observaciones: {
    type: String,
    trim: true
  },
  evaluacionPersonal: {
    type: String,
    trim: true
  },
  evaluador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Desempeno', DesempenoSchema);
