const Usuario = require('../models/Usuario');
//@desc: Registrar un nuevo usuario
//@route: POST /api/v1/auth/registro
//@access: Public
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        //Crear usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol
        });
        sendTokenResponse(usuario, 201, res);
    } catch (error) {
        res.status(400).json({
            sucess: false,
            message: error.message || 'Error al registrar el usuario'
        })
    }
}
//@desc: Iniciar sesión
//@route: POST /api/auth/login
//@access: Public
exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        // Verificar si el email y la contraseña fueron proporcionados
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, ingrese su email y contraseña'
            })
        }   
    //verificar si el usuario existe
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) {
        return res.status(401).json({
            success: false,
            message: 'Credenciales inválidas'
        });
    }
    //verificar si la contraseña es correcta
    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Credenciales inválidas'
        });
    }
    sendTokenResponse(usuario, 200, res);
  } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message || 'Error al iniciar sesión'
    })
  }
}
//@desc: Obtener perfil del usuario actual
//@route: GET /api/v1/auth/me
//@access: Private
exports.getMe = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id)
        res.status(200).json({
            success: true,
            data: usuario
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al obtener el usuario'
        })
    }
}

//@desc: Obtener usuarios administradores
//@route: GET /api/v1/auth/usuarios/admin
//@access: Private/Admin
exports.getAdminUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ 
            rol: { $in: ['admin', 'supervisor'] } 
        }).select('_id nombre email rol');
        
        res.status(200).json({
            success: true,
            count: usuarios.length,
            data: usuarios
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al obtener los usuarios administradores'
        });
    }
}
//Funcion para enviar la respuesta con el token
const sendTokenResponse = (usuario, statusCode, res) => {
    //Crear el token
    const token = usuario.getSignedJwtToken();
    //Enviar la respuesta
    res.status(statusCode).json({
        success: true,
        token
    });
}