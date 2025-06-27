// event-service/models/Event.js

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true // Elimina espacios en blanco al inicio/final
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1 // La capacidad debe ser al menos 1
  },
  estado: {
    type: String,
    enum: ['En planificacion', 'Activo', 'Finalizado'], // Solo estos valores son permitidos
    default: 'En planificacion'
  },
  organizadorId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del usuario organizador
    required: true
    // IMPORTANTE: Este campo se vinculará con el _id de un usuario en tu Auth Service
    // No haremos la validación de que el ID exista aquí, ya que los microservicios
    // son independientes. Se asume que el Auth Service maneja la creación de usuarios.
  }
}, {
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});

const Event = mongoose.model('Event', eventSchema);
export default Event;