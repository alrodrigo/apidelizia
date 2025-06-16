const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const Usuario = require('../src/models/Usuario');
const Agencia = require('../src/models/Agencia');
const Empleado = require('../src/models/Empleado');
const Desempeno = require('../src/models/Desempeno');
const Asistencia = require('../src/models/Asistencia');
const Observacion = require('../src/models/Observacion');

async function createTestData() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conectado a MongoDB');

    // Crear usuario admin si no existe
    let adminUser = await Usuario.findOne({ email: 'admin@delizia.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@delizia.com',
        password: hashedPassword,
        rol: 'admin'
      });
      console.log('Usuario admin creado');
    } else {
      console.log('Usuario admin ya existe');
    }

    // Crear agencias de ejemplo
    const agencias = [
      {
        nombre: 'Agencia Centro',
        direccion: 'Av. Principal 123',
        telefono: '123-456-7890',
        ciudad: 'La Paz'
      },
      {
        nombre: 'Agencia Norte',
        direccion: 'Calle Norte 456',
        telefono: '123-456-7891',
        ciudad: 'El Alto'
      },
      {
        nombre: 'Agencia Sur',
        direccion: 'Zona Sur 789',
        telefono: '123-456-7892',
        ciudad: 'La Paz'
      }
    ];

    const agenciasCreadas = [];
    for (const agenciaData of agencias) {
      let agencia = await Agencia.findOne({ nombre: agenciaData.nombre });
      if (!agencia) {
        agencia = await Agencia.create(agenciaData);
        console.log(`Agencia ${agencia.nombre} creada`);
      }
      agenciasCreadas.push(agencia);
    }

    // Crear empleados de ejemplo
    const empleados = [
      {
        nombre: 'Juan Carlos',
        apellido: 'Pérez López',
        ci: '12345678',
        sexo: 'masculino',
        edad: 28,
        correo: 'juan.perez@delizia.com',
        telefono: '555-0001',
        puesto: 'Supervisor',
        agencia: agenciasCreadas[0]._id,
        fechaIngreso: new Date('2023-01-15'),
        salario: 5000,
        estado: 'activo'
      },
      {
        nombre: 'María Elena',
        apellido: 'García Morales',
        ci: '87654321',
        sexo: 'femenino',
        edad: 25,
        correo: 'maria.garcia@delizia.com',
        telefono: '555-0002',
        puesto: 'Cajera',
        agencia: agenciasCreadas[0]._id,
        fechaIngreso: new Date('2023-03-10'),
        salario: 3500,
        estado: 'activo'
      },
      {
        nombre: 'Carlos Alberto',
        apellido: 'Mendoza Silva',
        ci: '11223344',
        sexo: 'masculino',
        edad: 32,
        correo: 'carlos.mendoza@delizia.com',
        telefono: '555-0003',
        puesto: 'Vendedor',
        agencia: agenciasCreadas[1]._id,
        fechaIngreso: new Date('2022-11-20'),
        salario: 4000,
        estado: 'activo'
      },
      {
        nombre: 'Ana Isabel',
        apellido: 'Rodriguez Vega',
        ci: '55667788',
        sexo: 'femenino',
        edad: 29,
        correo: 'ana.rodriguez@delizia.com',
        telefono: '555-0004',
        puesto: 'Recepcionista',
        agencia: agenciasCreadas[1]._id,
        fechaIngreso: new Date('2023-02-05'),
        salario: 3200,
        estado: 'activo'
      },
      {
        nombre: 'Luis Fernando',
        apellido: 'Choque Mamani',
        ci: '99887766',
        sexo: 'masculino',
        edad: 24,
        correo: 'luis.choque@delizia.com',
        telefono: '555-0005',
        puesto: 'Asistente',
        agencia: agenciasCreadas[2]._id,
        fechaIngreso: new Date('2023-05-12'),
        salario: 2800,
        estado: 'activo'
      }
    ];

    const empleadosCreados = [];
    for (const empleadoData of empleados) {
      let empleado = await Empleado.findOne({ ci: empleadoData.ci });
      if (!empleado) {
        empleado = await Empleado.create(empleadoData);
        console.log(`Empleado ${empleado.nombre} ${empleado.apellido} creado`);
      }
      empleadosCreados.push(empleado);
    }

    // Crear registros de desempeño
    const desempenos = [
      {
        empleado: empleadosCreados[0]._id,
        puntualidad: 4,
        proactividad: 5,
        calidadServicio: 4,
        observaciones: 'Excelente supervisión y liderazgo del equipo',
        evaluacionPersonal: 'Muy buen desempeño general, destaca en liderazgo',
        evaluador: adminUser._id,
        fecha: new Date('2023-12-01')
      },
      {
        empleado: empleadosCreados[1]._id,
        puntualidad: 5,
        proactividad: 4,
        calidadServicio: 5,
        observaciones: 'Muy responsable en el manejo de dinero',
        evaluacionPersonal: 'Excelente atención al cliente',
        evaluador: adminUser._id,
        fecha: new Date('2023-12-01')
      },
      {
        empleado: empleadosCreados[2]._id,
        puntualidad: 3,
        proactividad: 4,
        calidadServicio: 4,
        observaciones: 'Buen vendedor, pero puede mejorar la puntualidad',
        evaluacionPersonal: 'Desempeño satisfactorio en ventas',
        evaluador: adminUser._id,
        fecha: new Date('2023-11-15')
      }
    ];

    for (const desempenoData of desempenos) {
      const existeDesempeno = await Desempeno.findOne({
        empleado: desempenoData.empleado,
        fecha: desempenoData.fecha
      });
      
      if (!existeDesempeno) {
        await Desempeno.create(desempenoData);
        console.log(`Desempeño creado para empleado ${desempenoData.empleado}`);
      }
    }

    // Crear asistencias de ejemplo (últimos 7 días)
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(today);
      fecha.setDate(today.getDate() - i);
      
      for (const empleado of empleadosCreados) {
        const existeAsistencia = await Asistencia.findOne({
          empleado: empleado._id,
          fecha: {
            $gte: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
            $lt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)
          }
        });
        
        if (!existeAsistencia) {
          const estados = ['presente', 'ausente', 'tardanza'];
          const estado = estados[Math.floor(Math.random() * estados.length)];
          
          const asistenciaData = {
            empleado: empleado._id,
            fecha: fecha,
            estado: estado,
            registradoPor: adminUser._id
          };
          
          if (estado === 'presente' || estado === 'tardanza') {
            asistenciaData.horaEntrada = new Date(fecha);
            asistenciaData.horaEntrada.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
            
            asistenciaData.horaSalida = new Date(fecha);
            asistenciaData.horaSalida.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          }
          
          if (estado === 'tardanza') {
            asistenciaData.observaciones = 'Llegó tarde por tráfico';
          } else if (estado === 'ausente') {
            asistenciaData.observaciones = 'Ausencia justificada';
          }
          
          await Asistencia.create(asistenciaData);
        }
      }
    }
    console.log('Asistencias de ejemplo creadas');

    // Crear observaciones de ejemplo
    const observaciones = [
      {
        empleado: empleadosCreados[0]._id,
        tipo: 'positiva',
        titulo: 'Excelente liderazgo',
        descripcion: 'Excelente manejo de situaciones difíciles con clientes',
        registradoPor: adminUser._id,
        fecha: new Date('2023-12-10')
      },
      {
        empleado: empleadosCreados[2]._id,
        tipo: 'neutral',
        titulo: 'Área de mejora - Puntualidad',
        descripcion: 'Necesita mejorar la puntualidad en las mañanas',
        desarrollo: 'Se recomienda ajustar horarios de transporte',
        registradoPor: adminUser._id,
        fecha: new Date('2023-11-20')
      }
    ];

    for (const observacionData of observaciones) {
      const existeObservacion = await Observacion.findOne({
        empleado: observacionData.empleado,
        titulo: observacionData.titulo
      });
      
      if (!existeObservacion) {
        await Observacion.create(observacionData);
        console.log(`Observación creada para empleado ${observacionData.empleado}`);
      }
    }

    console.log('✓ Datos de prueba creados exitosamente');
    console.log('\nCredenciales de acceso:');
    console.log('Email: admin@delizia.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error al crear datos de prueba:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

createTestData();
