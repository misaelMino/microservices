import Activity from '../models/Activity.js';

export const registerActivity = async ({ title, description, startTime, endTime, roomId, exhibitorId, eventId }) => {
  
  //logica para ver si la hora de la actividad está dentro del rango de la hora del evento
  //logica para ver si en ese evento la sala solicitada está disponible en el rango de horario de inicio y fin
  //logica para ver si el expositor no está en otra actividad
 
  const newActivity = new Activity({
    title,
    description,
    startTime,
    endTime,
    roomId,
    exhibitorId,
    eventId
  });

  return await newActivity.save();
};