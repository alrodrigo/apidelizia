const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
// Cargar variables de entorno
dotenv.config()
// Conectar a la base de datos
connectDB()
const app = express()
// Middleware
app.use(cors())
app.use(express.json())
// Routes
app.get('/', (req, res) => {
    res.send('API de control de personal Delizia funcionando')
})
// Montar rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/agencias', require('./routes/agencias'));
app.use('/api/asistencias', require('./routes/asistencias'));
app.use('/api/desempenos', require('./routes/desempenos'));
app.use('/api/observaciones', require('./routes/observaciones'));
// Mangement rutes no founded
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
