const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  // Información Personal Básica
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del empleado'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'Por favor ingrese el apellido del empleado'],
    trim: true
  },
  ci: {
    type: String,
    required: [true, 'Por favor ingrese el CI del empleado'],
    unique: true,
    trim: true
  },
  sexo: {
    type: String,
    enum: ['masculino', 'femenino', 'otro'],
    required: [true, 'Por favor seleccione el sexo del empleado']
  },
  edad: {
    type: Number
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  fechaNacimiento: {
    type: Date
  },
  
  // Información Laboral
  fechaContratacion: {
    type: Date,
    default: Date.now
  },
  puesto: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    default: function() {
      return this.puesto; // Si no se proporciona cargo, usar el puesto como valor por defecto
    }
  },
  agencia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agencia'
  },
  activo: {
    type: Boolean,
    default: true
  },
  
  // Antecedentes y Recomendaciones
  antecedentes: {
    type: String,
    trim: true
  },
  cargosAnteriores: {
    type: String,
    trim: true
  },
  recomendaciones: {
    type: String,
    trim: true
  },
  
  // Versión estructurada (para futuras versiones)
  cargosAnterioresEstructurados: [{
    empresa: String,
    cargo: String,
    fechaInicio: Date,
    fechaFin: Date,
    descripcion: String
  }],
  recomendacionesEstructuradas: [{
    nombre: String,
    telefono: String,
    relacion: String,
    comentario: String
  }],
  
  // Metadatos
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Empleado', EmpleadoSchema);