import express from 'express';
import authRoutes from './routes/AuthRoutes.js';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

// Otros routers...

export default app;




app.listen(3000, () => console.log('🚀 Server en puerto 3000'));



