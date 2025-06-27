import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notificationRoutes.js';
import { startReminderJob } from './cron/reminderJob.js';


dotenv.config();
startReminderJob();
const app = express();
app.use(express.json());

app.use('/api', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Mongo conectado');
    app.listen(3003, () => console.log('🚀 NotificationService on port 3003'));
  })
  .catch((err) => console.error('❌ Error de conexión:', err));
