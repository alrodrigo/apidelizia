const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('../src/models/Usuario');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await Usuario.findOne({ email: 'admin@delizia.com' });
    
    if (existingAdmin) {
      console.log('Usuario admin ya existe');
      console.log('Email: admin@delizia.com');
      console.log('Password: admin123');
      return;
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await Usuario.create({
      nombre: 'Administrador',
      email: 'admin@delizia.com',
      password: hashedPassword,
      rol: 'admin'
    });

    console.log('Usuario administrador creado exitosamente');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('ID:', admin._id);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

createAdmin();
