import {
  activityRegister,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} from '../services/activityService.js';
import Activity from '../models/Activity.js';

export const registerActController = async (req, res) => {
  try {
    const activity = await activityRegister(req.body);
    res.status(201).json({ message: '✅ Actividad creada con éxito', activity });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al cargar actividad' });
  }
};

export const getAllActivitiesController = async (req, res) => {
  try {
    const { eventId, exhibitorId } = req.query;
    const filter = {};

    if (eventId) filter.eventId = eventId;
    if (exhibitorId) filter.exhibitorId = exhibitorId;

    const activities = await getAllActivities(filter);
    res.json(activities);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const getActivityByIdController = async (req, res) => {
  try {
    const activity = await getActivityById(req.params.id);
    res.json(activity);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const updateActivityController = async (req, res) => {
  try {
    const activity = await updateActivity(req.params.id, req.body);
    res.json({ message: '✅ Actividad actualizada', activity });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const deleteActivityController = async (req, res) => {
  try {
    const activity = await deleteActivity(req.params.id);
    res.json({ message: '🗑️ Actividad eliminada', activity });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const getUpcomingActivities = async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutesBefore) || 60;
    const now = new Date();
    const upperBound = new Date(now.getTime() + minutes * 60000);

    const upcomingActivities = await Activity.find({
      startTime: { $gte: now, $lte: upperBound }
    }).populate('exhibitorId'); // si querés más info

    res.json(upcomingActivities);
  } catch (err) {
    console.error('❌ Error en getUpcomingActivities:', err);
    res.status(500).json({ error: 'Error al buscar actividades próximas' });
  }
};
