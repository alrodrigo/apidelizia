const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelo Usuario simplificado para este script
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'manager', 'usuario'], default: 'usuario' }
});

const Usuario = mongoose.model('Usuario', userSchema);

async function createAdminDirectly() {
  try {
    // URI directa de MongoDB Atlas
    const mongoUri = 'mongodb+srv://alrodrigo:kzlvbimoEMJF14On@alvaro.q28r0ui.mongodb.net/delizia_db?retryWrites=true&w=majority&appName=Alvaro';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB Atlas');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ email: 'admin@delizia.com' });
    
    if (adminExistente) {
      console.log('⚠️ El usuario admin ya existe');
      
      // Actualizar la contraseña
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminExistente.password = hashedPassword;
      await adminExistente.save();
      console.log('✅ Contraseña del admin actualizada');
    } else {
      // Crear nuevo admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const nuevoAdmin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@delizia.com',
        password: hashedPassword,
        rol: 'admin'
      });

      await nuevoAdmin.save();
      console.log('✅ Usuario admin creado exitosamente');
    }

    console.log('📋 Credenciales de acceso:');
    console.log('Email: admin@delizia.com');
    console.log('Contraseña: admin123');
    
    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminDirectly();
