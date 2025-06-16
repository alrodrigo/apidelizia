const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
  empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  horaEntrada: {
    type: Date
  },
  horaSalida: {
    type: Date
  },
  tipoAsistencia: {
    type: String,
    enum: ['presente', 'ausente', 'permiso', 'vacaciones', 'licencia'],
    default: 'presente'
  },
  observaciones: {
    type: String
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})
module.exports = mongoose.model('Asistencia', AsistenciaSchema)