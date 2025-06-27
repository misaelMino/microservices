// services/activityValidation.js
import axios from 'axios';
import { EventDTO } from '../dto/EventDTO.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

export const isEventRangeAvailable = async (eventId, startTime, endTime) => {
  try {
    const response = await axios.get(`http://localhost:3001/events/${eventId}`); // consultar URL LU
    const event = new EventDTO(response.data);

    if (startTime < event.startDate || endTime > event.endDate) {
      throw { status: 400, message: 'La actividad debe estar dentro del rango del evento' };
    }
  } catch (err) {
    console.error('Error al validar rango del evento:', err.message || err);
    throw { status: 404, message: 'Evento no encontrado o servicio no disponible' };
  }
};

export const isUserAvailable = async (exhibitorId, startTime, endTime) => {
  const conflict = await Activity.findOne({
    exhibitorId: new mongoose.Types.ObjectId(exhibitorId),
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (conflict) {
    throw {
      status: 400,
      message: 'El expositor ya tiene una actividad en ese horario'
    };
  }
};