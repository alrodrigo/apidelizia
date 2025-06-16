const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Importar modelos
const Usuario = require('./src/models/Usuario');
const Agencia = require('./src/models/Agencia');
const Empleado = require('./src/models/Empleado');
const Desempeno = require('./src/models/Desempeno');
const Observacion = require('./src/models/Observacion');
const Asistencia = require('./src/models/Asistencia');

const seedData = async () => {
  try {
    // Limpiar la base de datos (opcional)
    // await Usuario.deleteMany({});
    // await Agencia.deleteMany({});
    // await Empleado.deleteMany({});
    // await Desempeno.deleteMany({});
    // await Observacion.deleteMany({});
    // await Asistencia.deleteMany({});

    // 1. Crear usuario administrador
    const hashedPassword = await bcrypt.hash('123456', 10);
    let usuario1 = await Usuario.findOne({ email: 'admin@delizia.com' });
    if (!usuario1) {
      usuario1 = await Usuario.create({
        id: 1,
        nombre: 'Administrador',
        email: 'admin@delizia.com',
        password: hashedPassword,
        rol: 'admin'
      });
      console.log('Usuario administrador creado');
    } else {
      console.log('Usuario administrador ya existe');
    }

    // 2. Crear agencias de ejemplo
    let agencia1 = await Agencia.findOne({ nombre: 'Agencia Central' });
    if (!agencia1) {
      agencia1 = await Agencia.create({
        nombre: 'Agencia Central',
        direccion: 'Av. Principal 123',
        ciudad: 'La Paz',
        telefono: '555-0001'
      });
      console.log('Agencia Central creada');
    }

    let agencia2 = await Agencia.findOne({ nombre: 'Agencia Norte' });
    if (!agencia2) {
      agencia2 = await Agencia.create({
        nombre: 'Agencia Norte',
        direccion: 'Calle Norte 456',
        ciudad: 'Santa Cruz',
        telefono: '555-0002'
      });
      console.log('Agencia Norte creada');
    }

    // 3. Crear empleados de ejemplo
    const empleados = [
      {
        nombre: 'Carlos',
        apellido: 'Rodriguez',
        ci: '12345678',
        telefono: '555-1001',
        correo: 'carlos@delizia.com',
        sexo: 'masculino',
        edad: 28,
        puesto: 'Cajero',
        cargo: 'Cajero Senior',
        agencia: agencia1._id,
        fechaIngreso: new Date('2023-01-15'),
        salario: 3500,
        activo: true
      },
      {
        nombre: 'Ana',
        apellido: 'Martinez',
        ci: '87654321',
        telefono: '555-1002',
        correo: 'ana@delizia.com',
        sexo: 'femenino',
        edad: 25,
        puesto: 'Atención al Cliente',
        agencia: agencia1._id,
        fechaIngreso: new Date('2023-03-10'),
        salario: 3200,
        activo: true
      },
      {
        nombre: 'Luis',
        apellido: 'Fernandez',
        ci: '11223344',
        telefono: '555-1003',
        correo: 'luis@delizia.com',
        sexo: 'masculino',
        edad: 32,
        puesto: 'Supervisor',
        cargo: 'Supervisor de Área',
        agencia: agencia2._id,
        fechaIngreso: new Date('2022-11-05'),
        salario: 4500,
        activo: true
      }
    ];

    for (const empData of empleados) {
      const existeEmpleado = await Empleado.findOne({ ci: empData.ci });
      if (!existeEmpleado) {
        const empleado = await Empleado.create(empData);
        console.log(`Empleado ${empData.nombre} ${empData.apellido} creado`);

        // Crear evaluaciones de desempeño para cada empleado
        await Desempeno.create({
          empleado: empleado._id,
          fecha: new Date(),
          puntualidad: Math.floor(Math.random() * 2) + 4, // 4-5
          proactividad: Math.floor(Math.random() * 2) + 3, // 3-4
          calidadServicio: Math.floor(Math.random() * 2) + 4, // 4-5
          observaciones: `Evaluación de desempeño para ${empData.nombre}`,
          evaluacionPersonal: 'Buen desempeño general',
          evaluador: usuario1._id
        });

        // Crear observaciones para cada empleado
        await Observacion.create({
          empleado: empleado._id,
          tipo: Math.random() > 0.5 ? 'positiva' : 'neutra',
          descripcion: `Observación de ejemplo para ${empData.nombre}`,
          fecha: new Date(),
          createdBy: usuario1._id
        });

        // Crear asistencias para la semana actual
        const hoy = new Date();
        for (let i = 0; i < 5; i++) {
          const fecha = new Date(hoy);
          fecha.setDate(fecha.getDate() - i);
          
          await Asistencia.create({
            empleado: empleado._id,
            fecha: fecha,
            horaEntrada: new Date(fecha.getTime() + 8 * 60 * 60 * 1000), // 8:00 AM
            horaSalida: new Date(fecha.getTime() + 17 * 60 * 60 * 1000), // 5:00 PM
            estado: Math.random() > 0.1 ? 'presente' : 'tarde',
            observaciones: 'Asistencia registrada automáticamente',
            registradoPor: usuario1._id
          });
        }
      }
    }

    console.log('Datos de ejemplo creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al crear datos de ejemplo:', error);
    process.exit(1);
  }
};

// Ejecutar
const main = async () => {
  await connectDB();
  await seedData();
};

main();
