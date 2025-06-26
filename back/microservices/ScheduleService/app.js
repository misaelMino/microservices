import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes.js';

dotenv.config(); 

const app = express();
app.use(express.json());

// Conexión a MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    app.use('/auth', authRoutes);
    app.listen(3001, () => {
      console.log('🚀 Server en puerto 3001');
    });
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();
