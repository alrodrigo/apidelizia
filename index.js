// Importaciones
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'supervisor'], default: 'admin' }
}, { timestamps: true });

// Modelo de Usuario
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);

// Variable para el estado de conexión
let cachedConnection = null;

// Función para conectar a MongoDB
async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = connection;
    console.log('✅ Conectado a MongoDB Atlas');
    return connection;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

// Función API para Vercel Serverless
module.exports = async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Logging para debug
    console.log('API llamada:', req.method, req.url);
    console.log('Body:', req.body);

    // Ruta raíz - test
    if (req.method === 'GET' && (!req.url || req.url === '/' || req.url === '')) {
      return res.json({ 
        message: 'API de control de personal Delizia funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.1',
        env: {
          nodeEnv: process.env.NODE_ENV,
          hasMongoUri: !!process.env.MONGODB_URI,
          hasJwtSecret: !!process.env.JWT_SECRET
        }
      });
    }

    // Ruta de login
    if (req.method === 'POST' && (req.url === '/auth/login' || req.url?.includes('auth/login'))) {
      const { email, password } = req.body;
      
      console.log('Intento de login:', email);

      // Verificar que tengamos las variables de entorno
      if (!process.env.MONGODB_URI) {
        return res.status(500).json({ 
          error: 'MONGODB_URI no configurado',
          env: Object.keys(process.env).filter(k => k.includes('MONGO'))
        });
      }

      // Conectar a la base de datos
      await connectToDatabase();

      // Buscar usuario
      const usuario = await Usuario.findOne({ email: email.toLowerCase() });
      if (!usuario) {
        console.log('Usuario no encontrado:', email);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const esValida = await bcryptjs.compare(password, usuario.password);
      if (!esValida) {
        console.log('Contraseña incorrecta para:', email);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: usuario._id, 
          email: usuario.email, 
          rol: usuario.rol 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      console.log('Login exitoso para:', email);
      
      return res.json({
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    }

    // Ruta de registro
    if (req.method === 'POST' && (req.url === '/auth/register' || req.url?.includes('auth/register'))) {
      const { nombre, email, password, rol } = req.body;
      
      console.log('Intento de registro:', email);

      // Validaciones básicas
      if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      // Conectar a la base de datos
      await connectToDatabase();

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Hashear contraseña
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      // Crear nuevo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol: rol || 'admin'
      });

      await nuevoUsuario.save();

      // Generar token
      const token = jwt.sign(
        { 
          id: nuevoUsuario._id, 
          email: nuevoUsuario.email, 
          rol: nuevoUsuario.rol 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      console.log('Registro exitoso para:', email);
      
      return res.status(201).json({
        token,
        usuario: {
          id: nuevoUsuario._id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol
        }
      });
    }

    // Ruta no encontrada
    return res.status(404).json({ 
      message: 'Ruta no encontrada', 
      method: req.method,
      url: req.url
    });

  } catch (error) {
    console.error('Error en API:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message,
      stack: error.stack
    });
  }
};