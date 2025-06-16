const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./src/config/database')

// Cargar variables de entorno
dotenv.config()

// Crear la app de Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Conectar a la base de datos
connectDB()

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de control de personal Delizia funcionando',
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET
        }
    })
})

// Montar rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/empleados', require('./src/routes/empleados'));
app.use('/api/agencias', require('./src/routes/agencias'));
app.use('/api/asistencias', require('./src/routes/asistencias'));
app.use('/api/desempenos', require('./src/routes/desempenos'));
app.use('/api/observaciones', require('./src/routes/observaciones'));

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' })
})

// Exportar como función serverless
module.exports = app;