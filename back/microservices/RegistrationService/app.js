// registration-service/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Carga las variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3002; // Puerto para el servicio de inscripciones

// Middleware para que Express entienda JSON en las peticiones
app.use(express.json());

// --- Conexión a la Base de Datos ---
const mongoUri = process.env.MONGO_URI; // Obtiene la URI desde .env

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB (Registration Service)'))
  .catch(err => console.error('Error al conectar a MongoDB (Registration Service):', err));

// --- Importar y Usar Rutas de Inscripciones (las crearemos en el siguiente paso) ---
const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/v1/registrations', registrationRoutes); // Prefijo para todas las rutas de inscripción

// --- Ruta de Prueba ---
// Ruta de ejemplo: GET /
app.get('/', (req, res) => {
  res.send('Servicio de Inscripciones funcionando!');
});

// --- Iniciar el Servidor ---
app.listen(port, () => {
  console.log(`Servicio de Inscripciones escuchando en http://localhost:${port}`);
});