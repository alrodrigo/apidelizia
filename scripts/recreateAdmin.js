const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');

require('dotenv').config();

const recreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    // Eliminar el usuario admin existente
    await Usuario.deleteOne({ email: 'admin@delizia.com' });
    console.log('Usuario admin anterior eliminado');

    // Crear nuevo usuario admin
    const adminUser = new Usuario({
      nombre: 'Administrador',
      email: 'admin@delizia.com',
      password: 'admin123',
      rol: 'admin'
    });

    await adminUser.save();
    console.log('Nuevo usuario admin creado');
    
    // Verificar que funciona
    const admin = await Usuario.findOne({ email: 'admin@delizia.com' }).select('+password');
    const isMatch = await admin.matchPassword('admin123');
    console.log('¿Password "admin123" coincide ahora?:', isMatch);
    
    mongoose.connection.close();
    console.log('✓ Usuario admin recreado exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
};

recreateAdmin();
