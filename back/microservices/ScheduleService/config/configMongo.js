import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ limpio
    console.log('✅ Conectado a MongoDB');
  } catch (e) {
    console.error('❌ Error al conectar:', e.message);
    process.exit(1);
  }
};

connectMongo();
