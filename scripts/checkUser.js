const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    // Buscar el usuario admin
    const admin = await Usuario.findOne({ email: 'admin@delizia.com' }).select('+password');
    
    if (admin) {
      console.log('Usuario encontrado:');
      console.log('Email:', admin.email);
      console.log('Rol:', admin.rol);
      console.log('Password hash:', admin.password);
      
      // Verificar si la contraseña 'admin123' coincide
      const isMatch = await admin.matchPassword('admin123');
      console.log('¿Password "admin123" coincide?:', isMatch);
      
      // También probar directamente con bcrypt
      const directMatch = await bcrypt.compare('admin123', admin.password);
      console.log('¿Password "admin123" coincide (bcrypt directo)?:', directMatch);
      
    } else {
      console.log('Usuario admin no encontrado');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

checkUser();
