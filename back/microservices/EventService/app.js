//### 2. Servicio de Eventos (Event Service)

// - Gestionar la creación y configuración de eventos
// - Administrar fechas, ubicaciones y capacidades
// - Controlar estados de los eventos (planificación, activo, finalizado)

//ruta crear
//ruta configurrar
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Carga las variables de entorno

const app = express();
const port = process.env.PORT || 3001; // Puerto para tu servicio de eventos
// Middleware para que Express entienda JSON en las peticiones
app.use(express.json());

// --- Conexión a la Base de Datos ---
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://luciapigliacampi90:4614233Bp@cluster0.dmoaye6.mongodb.net/eventDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const eventRoutes = require('./routes/eventRoutes');

app.use('/api/v1/events', eventRoutes); // Esto hace que todas las rutas de eventRoutes empiecen con /api/v1/events

// --- Rutas de Prueba ---
// Ruta de ejemplo: GET /
app.get('/', (req, res) => {
  res.send('Servicio de Eventos funcionando!');
});

// Puedes empezar a definir tus rutas de eventos aquí
// Por ejemplo:
// app.get('/events', (req, res) => {
//   res.json({ message: 'Lista de eventos (próximamente)' });
// });

// --- Iniciar el Servidor ---
app.listen(port, () => {
  console.log(`Servicio de Eventos escuchando en http://localhost:${port}`);
});