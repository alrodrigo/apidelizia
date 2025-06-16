// Script para crear usuario admin en MongoDB Atlas
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'supervisor'], default: 'admin' }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

async function createAdmin() {
  try {
    // Conectar a MongoDB Atlas
    const mongoUri = 'mongodb+srv://admin:admin123@cluster0.ebnkgit.mongodb.net/delizia_personal?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB Atlas');

    // Verificar si el usuario admin ya existe
    const adminExistente = await Usuario.findOne({ email: 'admin@delizia.com' });
    
    if (adminExistente) {
      console.log('✅ Usuario admin ya existe:', adminExistente.email);
      console.log('Información del usuario:');
      console.log('- Nombre:', adminExistente.nombre);
      console.log('- Email:', adminExistente.email);
      console.log('- Rol:', adminExistente.rol);
      console.log('- Creado:', adminExistente.createdAt);
      
      // Verificar password
      const passwordValida = await bcryptjs.compare('admin123', adminExistente.password);
      console.log('- Password "admin123" válida:', passwordValida ? '✅ Sí' : '❌ No');
      
    } else {
      console.log('🔄 Creando usuario admin...');
      
      // Hashear password
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash('admin123', saltRounds);
      
      // Crear usuario admin
      const nuevoAdmin = new Usuario({
        nombre: 'Administrador',
        email: 'admin@delizia.com',
        password: hashedPassword,
        rol: 'admin'
      });
      
      await nuevoAdmin.save();
      console.log('✅ Usuario admin creado exitosamente');
      console.log('- Email: admin@delizia.com');
      console.log('- Password: admin123');
      console.log('- Rol: admin');
    }
    
    // Listar todos los usuarios
    const usuarios = await Usuario.find().select('nombre email rol createdAt');
    console.log('\n📋 Usuarios en la base de datos:');
    usuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre} (${user.email}) - ${user.rol}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔚 Desconectado de MongoDB');
  }
}

// Ejecutar
createAdmin();
