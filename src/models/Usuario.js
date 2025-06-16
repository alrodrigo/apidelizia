const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuariosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Por favor, ingrese su correo electrónico'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'Por favor, ingrese su contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false, // No mostrar la contraseña por defecto
    },
    rol: {
        type: String,
        enum: ['admin', 'supervisor', 'operador'],
        default: 'operador',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
//Encriptar la contraseña usando bcrypt
UsuariosSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
//Generar un token JWT
UsuariosSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN)
    })
}
//Metodo para verificar la contraseña
UsuariosSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
//Exportar el modelo
module.exports = mongoose.model('Usuario', UsuariosSchema);