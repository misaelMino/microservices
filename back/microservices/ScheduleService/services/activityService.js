import { isEventRangeAvailable, isRoomAvailable, isUserAvailable } from './activityValidation.js';
import Activity from '../models/Activity.js';

export const activityRegister = async (data) => {
await isEventRangeAvailable(data.eventId, data.startTime, data.endTime);
await isRoomAvailable(data.roomId, data.startTime, data.endTime, data.eventId);
await isUserAvailable(data.exhibitorId, data.startTime, data.endTime);

  const newActivity = new Activity(data);
  return await newActivity.save();
};

export const getAllActivities = async (filter = {}) => {
  return await Activity.find(filter).populate('roomId exhibitorId eventId');
};

export const getActivityById = async (id) => {
  const activity = await Activity.findById(id).populate('roomId exhibitorId eventId');
  if (!activity) throw { status: 404, message: 'Actividad no encontrada' };
  return activity;
};

export const updateActivity = async (id, newData) => {
  // Si se cambian horarios, expositor o sala, validar
  if (newData.startTime || newData.endTime || newData.roomId || newData.exhibitorId) {
    await isEventRangeAvailable(newData.eventId, newData.startTime, newData.endTime);
    await isRoomAvailable(newData.roomId, newData.startTime, newData.endTime, newData.eventId);
    await isUserAvailable(newData.exhibitorId, newData.startTime, newData.endTime);
  }

  const updated = await Activity.findByIdAndUpdate(id, newData, { new: true });
  if (!updated) throw { status: 404, message: 'Actividad no encontrada para actualizar' };
  return updated;
};

export const deleteActivity = async (id) => {
  const deleted = await Activity.findByIdAndDelete(id);
  if (!deleted) throw { status: 404, message: 'Actividad no encontrada para eliminar' };
  return deleted;
};