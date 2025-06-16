const mongoose = require('mongoose');

const AgenciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese el nombre de la agencia'],
    trim: true,
    unique: true
  },
  direccion: {
    type: String,
    required: [true, 'Por favor ingrese la dirección de la agencia'],
    trim: true
  },
  ciudad: {
    type: String,
    required: [true, 'Por favor ingrese la ciudad'],
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  encargado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Agencia', AgenciaSchema)