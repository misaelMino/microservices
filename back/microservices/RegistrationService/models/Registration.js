// registration-service/models/Registration.js

import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  participanteId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del usuario asistente (del Auth Service)
    required: true
  },
  eventoId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del evento (del Event Service)
    required: true
  },
  fechaInscripcion: {
    type: Date,
    default: Date.now // Por defecto, la fecha actual de la inscripción
  },
  tipoInscripcion: {
    type: String,
    enum: ['regular', 'VIP', 'expositor'], // Tipos de inscripción permitidos
    default: 'regular'
  },
  tarifa: {
    type: Number,
    required: true,
    min: 0 // La tarifa no puede ser negativa
  },
  codigoQR: {
    type: String, // Almacenará el dato único para generar el QR (ej. un UUID o un ID de la propia inscripción)
    unique: true, // Asegura que cada código QR sea único
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'], // Estados de la inscripción
    default: 'pendiente'
  }
}, {
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});


const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;