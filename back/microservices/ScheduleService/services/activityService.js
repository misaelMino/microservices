import { validarRangoEvento, validarSalaLibre, validarExpositorLibre } from './activityValidation.js';

export const registerActivity = async (data) => {
  await validarRangoEvento(data.eventId, data.startTime, data.endTime);
  await validarSalaLibre(data.roomId, data.startTime, data.endTime, data.eventId);
  await validarExpositorLibre(data.exhibitorId, data.startTime, data.endTime);

  const newActivity = new Activity(data);
  return await newActivity.save();
};