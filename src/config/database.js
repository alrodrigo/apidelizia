const mongoose = require('mongoose')
const connectDB= async () => {
    try {
     const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
     console.log('Intentando conectar a MongoDB...');
     const conn = await mongoose.connect(mongoUri)
     console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
}
module.exports = connectDB