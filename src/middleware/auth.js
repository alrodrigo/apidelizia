const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
// Middleware para proteger rutas y verificar roles de usuario
exports.protect = async (req, res, next) => {
    let token
    //verificar si el token existe en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    //verificar si el token existe
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No esta autorizado para acceder a este ruta'
        })
    }
    try {
        //verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //asignar el usuario a la request
        req.usuario= await Usuario.findById(decoded.id)
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'No esta autorizado para acceder a este ruta'
        })
    }
}
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Si el usuario tiene ID 1, siempre tendrá acceso completo
    if (req.usuario.id == 1) {
      return next();
    }
    
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.usuario.rol} no está autorizado para acceder a esta ruta`
      });
    }
    next();
  }
}